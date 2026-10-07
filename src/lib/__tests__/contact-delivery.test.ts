import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverContactSubmission } from "../contact-delivery";
import { AUTO_REPLY_HTML, AUTO_REPLY_TEXT, EMAIL_LOGO_URL } from "../auto-reply-email";

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
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("sends the auto-reply to the submitter", async () => {
    const fetchMock = mockFetch(() => true);
    await deliverContactSubmission(submission, fullEnv);
    const bodies = fetchMock.mock.calls
      .filter(([url]) => String(url).includes("resend"))
      .map(([, init]) => JSON.parse(String(init?.body)));
    const reply = bodies.find((b) => b.to[0] === submission.email);
    expect(reply?.text).toBe(AUTO_REPLY_TEXT);
    expect(reply?.html).toBe(AUTO_REPLY_HTML);
  });

  it("brands the auto-reply with a serif font and the AMG logo signature", () => {
    expect(AUTO_REPLY_HTML).toContain("font-family:Georgia");
    expect(AUTO_REPLY_HTML).toContain(`src="${EMAIL_LOGO_URL}"`);
    expect(EMAIL_LOGO_URL).toMatch(/^https:\/\/.+\.png$/);
    expect(AUTO_REPLY_TEXT).toContain("Anchor Mill Group\nResilience");
  });

  it("does not fail the inquiry when the auto-reply fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    let resendCalls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      if (String(input).includes("resend")) {
        resendCalls += 1;
        return new Response(null, { status: resendCalls === 1 ? 200 : 500 });
      }
      return new Response(null, { status: 200 });
    });
    const outcome = await deliverContactSubmission(submission, fullEnv);
    expect(outcome).toEqual({ ok: true, delivered: ["email", "portal"], failed: [] });
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
