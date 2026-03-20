"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  organization: z.string().trim().min(2, "Organization is required"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Please provide more detail"),
});

export type ContactFormState = {
  success: boolean;
  errors: Partial<Record<"name" | "organization" | "email" | "phone" | "message", string>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name") as string ?? "",
    organization: formData.get("organization") as string ?? "",
    email: formData.get("email") as string ?? "",
    phone: formData.get("phone") as string ?? "",
    message: formData.get("message") as string ?? "",
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    const errors: ContactFormState["errors"] = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ContactFormState["errors"];
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
    return { success: false, errors };
  }

  // TODO: Integrate email service (e.g., Resend, SendGrid)

  // Log submission metadata (excluding message body for privacy)
  console.log("[Contact Form Submission]", {
    name: result.data.name,
    email: result.data.email,
    organization: result.data.organization,
    phone: result.data.phone ?? "(not provided)",
    timestamp: new Date().toISOString(),
  });

  return { success: true, errors: {} };
}
