import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../contact-form";
import type { ContactFormState } from "@/app/contact/actions";

vi.mock("@/lib/gsap", () => ({
  gsap: { fromTo: vi.fn() },
  ScrollTrigger: { getAll: () => [], refresh: vi.fn() },
  useGSAP: vi.fn(),
  initGSAP: vi.fn(),
}));

const mockSubmit = vi.fn<
  (state: ContactFormState, formData: FormData) => Promise<ContactFormState>
>();

vi.mock("@/app/contact/actions", () => ({
  submitContactForm: (...args: [ContactFormState, FormData]) =>
    mockSubmit(...args),
}));

function setupUser() {
  return userEvent.setup();
}

async function fillAndSubmit(user: ReturnType<typeof setupUser>) {
  await user.type(screen.getByLabelText(/^name$/i), "John Doe");
  await user.type(
    screen.getByLabelText(/^organization$/i),
    "Doe Family Office",
  );
  await user.type(screen.getByLabelText(/^email$/i), "john@example.com");
  await user.type(
    screen.getByLabelText(/^message$/i),
    "I need help with asset protection for my family.",
  );
  await user.click(screen.getByRole("button", { name: /send message/i }));
}

describe("ContactForm", () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it("renders the form with all fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^organization$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument();
  });

  it("renders an unchecked SMS consent checkbox with policy links", () => {
    render(<ContactForm />);

    const checkbox = screen.getByRole("checkbox", {
      name: /agree to receive recurring marketing and informational text messages from Anchor Mill Group/i,
    });
    expect(checkbox).not.toBeChecked();
    expect(screen.getByRole("link", { name: /anchormillgroup\.com\/privacy/i }))
      .toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /anchormillgroup\.com\/terms/i }))
      .toHaveAttribute("href", "/terms");
  });

  it("renders submit button with 'Send Message' text", () => {
    render(<ContactForm />);

    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({
      success: false,
      errors: {
        name: "Name must be at least 2 characters",
        organization: "Organization is required",
        email: "Please enter a valid email",
        message: "Please provide more detail",
      },
    });

    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Organization is required"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please provide more detail"),
    ).toBeInTheDocument();
    for (const [label, error] of [
      ["Name", "Name must be at least 2 characters"],
      ["Organization", "Organization is required"],
      ["Email", "Please enter a valid email"],
      ["Message", "Please provide more detail"],
    ]) {
      const field = screen.getByLabelText(label, { exact: true });
      expect(field).toHaveAttribute("aria-invalid", "true");
      expect(field).toHaveAccessibleDescription(expect.stringContaining(error));
      await user.click(screen.getByRole("link", { name: `Review ${label}` }));
      expect(field).toHaveFocus();
      await user.type(field, " ");
      await user.type(field, "A");
      expect(field).toHaveAttribute("aria-invalid", "true");
      expect(field).toHaveAccessibleDescription(expect.stringContaining(error));
    }
  });

  it("shows name error for short name (1 char)", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({
      success: false,
      errors: { name: "Name must be at least 2 characters" },
    });

    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^name$/i), "A");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
  });

  it("shows organization error for short org", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({
      success: false,
      errors: { organization: "Organization is required" },
    });

    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^organization$/i), "A");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Organization is required"),
    ).toBeInTheDocument();
  });

  it("shows email error for invalid email", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({
      success: false,
      errors: { email: "Please enter a valid email" },
    });

    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^email$/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Please enter a valid email"),
    ).toBeInTheDocument();
  });

  it("shows message error for short message (< 10 chars)", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({
      success: false,
      errors: { message: "Please provide more detail" },
    });

    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^message$/i), "Hi");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Please provide more detail"),
    ).toBeInTheDocument();
  });

  it("phone field is optional - no error when empty", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({
      success: false,
      errors: {
        name: "Name must be at least 2 characters",
        organization: "Organization is required",
        email: "Please enter a valid email",
        message: "Please provide more detail",
      },
    });

    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await screen.findByText("Name must be at least 2 characters");

    const errors = screen.queryAllByText(/phone/i);
    const phoneError = errors.filter((el) =>
      el.classList.contains("text-destructive"),
    );
    expect(phoneError).toHaveLength(0);
  });

  it("retains last-submission errors through edits until checked on resubmission", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({
      success: false,
      errors: {
        name: "Name must be at least 2 characters",
        email: "Please enter a valid email",
      },
    });

    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();

    const name = screen.getByLabelText(/^name$/i);
    await user.type(name, "J");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(/Name must be at least 2 characters/);
    await user.type(name, "o");
    expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
    expect(screen.getByText(/errors from your last submission stay visible/i)).toBeInTheDocument();

    // Other errors should remain
    expect(
      screen.getByText("Please enter a valid email"),
    ).toBeInTheDocument();
  });

  it("explains requirements and individual/family organization entries before submission", () => {
    render(<ContactForm />);
    expect(screen.getByText(/name, organization, email and message are required/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^name$/i)).toBeRequired();
    expect(screen.getByLabelText(/^name$/i)).toHaveAccessibleDescription(/at least 2 characters/i);
    expect(screen.getByLabelText(/^organization$/i)).toBeRequired();
    expect(screen.getByLabelText(/^organization$/i)).toHaveAccessibleDescription(/at least 2 characters.*individual or family.*Individual.*Doe family/i);
    expect(screen.getByLabelText(/^email$/i)).toHaveAccessibleDescription(/valid email address/i);
    expect(screen.getByLabelText(/^message$/i)).toHaveAccessibleDescription(/at least 10 characters/i);
    expect(screen.getByLabelText(/^phone/i)).not.toBeRequired();
    expect(screen.getByRole("checkbox")).not.toBeRequired();
  });

  it("keeps a first-time individual's values and announces linked organization recovery", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({ success: false, errors: { organization: "Organization is required" } });
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^name$/i), "John Doe");
    await user.type(screen.getByLabelText(/^email$/i), "john@example.com");
    await user.type(screen.getByLabelText(/^message$/i), "Please help protect my family.");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveFocus();
    await user.click(screen.getByRole("link", { name: "Review Organization" }));
    const organization = screen.getByLabelText(/^organization$/i);
    expect(organization).toHaveFocus();
    expect(organization).toHaveAccessibleDescription(/Organization is required/);
    await user.type(organization, " ");
    await user.type(organization, "A");
    expect(organization).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Organization is required")).toBeInTheDocument();
    await user.clear(organization);
    await user.type(organization, "Individual");
    expect(screen.getByLabelText(/^name$/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/^message$/i)).toHaveValue("Please help protect my family.");
    mockSubmit.mockResolvedValueOnce({ success: true, errors: {} });
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText("Thank You")).toBeInTheDocument();
    expect(mockSubmit.mock.calls[1]?.[1].get("organization")).toBe("Individual");
  });

  it("preserves phone, consent and other values on delivery failure", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({ success: false, errors: {}, formError: "Please email us directly." });
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^phone/i), "+1 555 123 4567");
    await user.click(screen.getByRole("checkbox"));
    await fillAndSubmit(user);
    expect(await screen.findByRole("alert")).toHaveTextContent("Please email us directly.");
    expect(screen.getByLabelText(/^name$/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/^organization$/i)).toHaveValue("Doe Family Office");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/^message$/i)).toHaveValue("I need help with asset protection for my family.");
    expect(screen.getByLabelText(/^phone/i)).toHaveValue("+1 555 123 4567");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("shows success state after valid submission", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({ success: true, errors: {} });

    render(<ContactForm />);
    await fillAndSubmit(user);

    expect(await screen.findByText("Thank You")).toBeInTheDocument();
    expect(screen.getByText(/no appointment has been booked/i))
      .toHaveTextContent(/a member of our team will review your request and reach out within 24 hours to arrange your confidential discovery/i);
  });

  it("success state has 'Send Another Message' button", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({ success: true, errors: {} });

    render(<ContactForm />);
    await fillAndSubmit(user);

    expect(
      await screen.findByRole("button", { name: /send another message/i }),
    ).toBeInTheDocument();
  });

  it("clicking 'Send Another Message' resets the form", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({ success: true, errors: {} });

    render(<ContactForm />);
    await fillAndSubmit(user);

    await screen.findByRole("button", { name: /send another message/i });
    await user.click(
      screen.getByRole("button", { name: /send another message/i }),
    );

    // Form should be back with empty fields
    expect(screen.getByLabelText(/^name$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^organization$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^message$/i)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it("renders the left column info text", () => {
    render(<ContactForm />);

    expect(
      screen.getByText("Begin Your Confidential Discovery"),
    ).toBeInTheDocument();
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    expect(screen.getByText(/submitting this form does not book an appointment/i))
      .toHaveTextContent(/a member of our team will review your inquiry and follow up to arrange a conversation/i);
    expect(screen.getByText("We respond within 24 hours to all inquiries."))
      .toBeInTheDocument();
  });

  it("renders the email link", () => {
    render(<ContactForm />);

    const emailLink = screen.getByRole("link", {
      name: /inquiries@anchormillgroup\.com/i,
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:inquiries@anchormillgroup.com",
    );
  });
});
