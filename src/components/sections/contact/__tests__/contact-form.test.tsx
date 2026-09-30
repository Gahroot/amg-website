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

  it("clears specific error when user types in that field", async () => {
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

    // Type in the name field to clear its error
    await user.type(screen.getByLabelText(/^name$/i), "Jo");

    expect(
      screen.queryByText("Name must be at least 2 characters"),
    ).not.toBeInTheDocument();

    // Other errors should remain
    expect(
      screen.getByText("Please enter a valid email"),
    ).toBeInTheDocument();
  });

  it("shows success state after valid submission", async () => {
    const user = setupUser();
    mockSubmit.mockResolvedValueOnce({ success: true, errors: {} });

    render(<ContactForm />);
    await fillAndSubmit(user);

    expect(await screen.findByText("Thank You")).toBeInTheDocument();
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
