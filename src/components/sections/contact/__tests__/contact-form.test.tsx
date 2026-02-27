import type { ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactForm } from "../contact-form";

vi.mock("@/components/ui/animate-on-scroll", () => ({
  AnimateOnScroll: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("ContactForm", () => {
  it("renders the form with all fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^organization$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument();
  });

  it("renders submit button with 'Send Message' text", () => {
    render(<ContactForm />);

    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByText("Name must be at least 2 characters")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Organization is required")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please provide more detail")
    ).toBeInTheDocument();
  });

  it("shows name error for short name (1 char)", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: "A" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByText("Name must be at least 2 characters")
    ).toBeInTheDocument();
  });

  it("shows organization error for short org", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/^organization$/i), {
      target: { value: "A" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText("Organization is required")).toBeInTheDocument();
  });

  it("shows email error for invalid email", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByText("Please enter a valid email")
    ).toBeInTheDocument();
  });

  it("shows message error for short message (< 10 chars)", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/^message$/i), {
      target: { value: "Hi" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByText("Please provide more detail")
    ).toBeInTheDocument();
  });

  it("phone field is optional - no error when empty", () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Phone should not generate any error
    const errors = screen.queryAllByText(/phone/i);
    const phoneError = errors.filter(
      (el) => el.classList.contains("text-destructive")
    );
    expect(phoneError).toHaveLength(0);
  });

  it("clears specific error when user types in that field", () => {
    render(<ContactForm />);

    // Submit to trigger errors
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(
      screen.getByText("Name must be at least 2 characters")
    ).toBeInTheDocument();

    // Type in the name field to clear its error
    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: "Jo" },
    });

    expect(
      screen.queryByText("Name must be at least 2 characters")
    ).not.toBeInTheDocument();

    // Other errors should remain
    expect(
      screen.getByText("Please enter a valid email")
    ).toBeInTheDocument();
  });

  it("shows success state after valid submission", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^organization$/i), {
      target: { value: "Doe Family Office" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^message$/i), {
      target: { value: "I need help with asset protection for my family." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText("THANK YOU")).toBeInTheDocument();
  });

  it("success state has 'Send Another Message' button", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^organization$/i), {
      target: { value: "Doe Family Office" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^message$/i), {
      target: { value: "I need help with asset protection for my family." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByRole("button", { name: /send another message/i })
    ).toBeInTheDocument();
  });

  it("clicking 'Send Another Message' resets the form", () => {
    render(<ContactForm />);

    // Fill and submit
    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^organization$/i), {
      target: { value: "Doe Family Office" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^message$/i), {
      target: { value: "I need help with asset protection for my family." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Click reset
    fireEvent.click(
      screen.getByRole("button", { name: /send another message/i })
    );

    // Form should be back with empty fields
    expect(screen.getByLabelText(/^name$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^organization$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^message$/i)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("renders the left column info text", () => {
    render(<ContactForm />);

    expect(
      screen.getByText("BEGIN YOUR CONFIDENTIAL DISCOVERY")
    ).toBeInTheDocument();
    expect(screen.getByText("GET IN TOUCH")).toBeInTheDocument();
  });

  it("renders the email link", () => {
    render(<ContactForm />);

    const emailLink = screen.getByRole("link", {
      name: /inquiries@anchormillgroup\.com/i,
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:inquiries@anchormillgroup.com"
    );
  });
});
