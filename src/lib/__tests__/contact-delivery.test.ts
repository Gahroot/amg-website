import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverContactSubmission } from "../contact-delivery";

const submission = {
  name: "Jane Doe",
  organization: "Doe Family Office",
  email: "jane@example.com",
  phone: undefined,
  message: "Looking for asset protection advice.",
  smsConsent: false,
};

const fullEnv = {
  RESEND_API_KEY: "re_test",
  CONTACT_FROM_EMAIL: "AMG <noreply@example.com>",
  PORTAL_WEBHOOK_URL: "https://portal.example.com/hook",
  PORTAL_WEBHOOK_SECRET: "s3cret",
};

afterEach(() => vi.restoreAllMocks());

function mockFetch(handler: (url: string) => boolean) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async (input) =>
      new Response(null, { status: handler(String(input)) ? 200 : 500 }),
    );
}

describe("deliverContactSubmission", () => {
  it("sends to both Resend and the portal", async () => {
    const fetchMock = mockFetch(() => true);
    const outcome = await deliverContactSubmission(submission, fullEnv);
    expect(outcome).toEqual({ ok: true, delivered: ["email", "portal"], failed: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("still succeeds when only the portal fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch((url) => url.includes("resend"));
    const outcome = await deliverContactSubmission(submission, fullEnv);
    expect(outcome).toEqual({ ok: true, delivered: ["email"], failed: ["portal"] });
  });

  it("fails when every channel fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch(() => false);
    const outcome = await deliverContactSubmission(submission, fullEnv);
    expect(outcome).toEqual({ ok: false, reason: "all-failed" });
  });

  it("reports not-configured when no env is set", async () => {
    const fetchMock = mockFetch(() => true);
    const outcome = await deliverContactSubmission(submission, {});
    expect(outcome).toEqual({ ok: false, reason: "not-configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
