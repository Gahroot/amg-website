import { randomUUID } from "node:crypto";
import { siteConfig } from "@/lib/site-config";

export type ContactSubmission = {
  name: string;
  organization: string;
  email: string;
  phone: string | undefined;
  message: string;
  smsConsent: boolean;
};

export type DeliveryChannel = "email" | "portal";

export type DeliveryOutcome =
  | { ok: true; delivered: DeliveryChannel[]; failed: DeliveryChannel[] }
  | { ok: false; reason: "not-configured" | "all-failed" };

type DeliveryEnv = Readonly<Record<string, string | undefined>>;

const REQUEST_TIMEOUT_MS = 8000;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

async function sendEmail(
  submission: ContactSubmission,
  env: DeliveryEnv,
  id: string,
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL ?? siteConfig.inquiryRecipient;
  const from = env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("email not configured");

  const text = [
    `Name: ${singleLine(submission.name)}`,
    `Organization: ${singleLine(submission.organization)}`,
    `Email: ${singleLine(submission.email)}`,
    `Phone: ${submission.phone ? singleLine(submission.phone) : "(not provided)"}`,
    `SMS consent: ${submission.smsConsent ? "yes" : "no"}`,
    `Reference: ${id}`,
    "",
    submission.message,
  ].join("\n");

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": id,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: submission.email,
      subject: `New inquiry: ${singleLine(submission.name)} (${singleLine(submission.organization)})`,
      text,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`resend responded ${res.status}`);
}

async function syncToPortal(
  submission: ContactSubmission,
  env: DeliveryEnv,
  id: string,
  submittedAt: string,
): Promise<void> {
  const url = env.PORTAL_WEBHOOK_URL;
  if (!url) throw new Error("portal not configured");
  if (!url.startsWith("https://") && env.NODE_ENV === "production") {
    throw new Error("portal webhook must use https");
  }

  const secret = env.PORTAL_WEBHOOK_SECRET;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": id,
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify({
      id,
      source: "website-contact-form",
      submittedAt,
      ...submission,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`portal responded ${res.status}`);
}

function isEmailConfigured(env: DeliveryEnv): boolean {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL);
}

/**
 * Sends a submission to every configured channel (Resend email + portal webhook).
 * Succeeds if at least one channel accepted it, so a portal outage never loses a lead.
 */
export async function deliverContactSubmission(
  submission: ContactSubmission,
  env: DeliveryEnv,
): Promise<DeliveryOutcome> {
  const id = randomUUID();
  const submittedAt = new Date().toISOString();

  const channels: { name: DeliveryChannel; run: () => Promise<void> }[] = [];
  if (isEmailConfigured(env)) {
    channels.push({ name: "email", run: () => sendEmail(submission, env, id) });
  }
  if (env.PORTAL_WEBHOOK_URL) {
    channels.push({
      name: "portal",
      run: () => syncToPortal(submission, env, id, submittedAt),
    });
  }

  if (channels.length === 0) return { ok: false, reason: "not-configured" };

  const results = await Promise.allSettled(channels.map((c) => c.run()));
  const delivered: DeliveryChannel[] = [];
  const failed: DeliveryChannel[] = [];
  results.forEach((result, i) => {
    const channel = channels[i];
    if (!channel) return;
    if (result.status === "fulfilled") {
      delivered.push(channel.name);
    } else {
      failed.push(channel.name);
      console.error("[Contact Delivery Failed]", {
        id,
        channel: channel.name,
        error: result.reason instanceof Error ? result.reason.message : "unknown",
      });
    }
  });

  console.log("[Contact Delivery]", { id, delivered, failed });
  return delivered.length > 0
    ? { ok: true, delivered, failed }
    : { ok: false, reason: "all-failed" };
}
