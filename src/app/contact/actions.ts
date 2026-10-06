"use server";

import { z } from "zod";
import { siteConfig } from "@/lib/site-config";
import { deliverContactSubmission } from "@/lib/contact-delivery";

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
  formError?: string;
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
  // Consent is only meaningful when a phone number was provided.
  const smsConsent =
    formData.get("smsConsent") === "yes" && raw.phone.trim() !== "";

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

  const outcome = await deliverContactSubmission(
    {
      name: result.data.name,
      organization: result.data.organization,
      email: result.data.email,
      phone: result.data.phone || undefined,
      message: result.data.message,
      smsConsent,
    },
    process.env,
  );

  if (!outcome.ok) {
    // In local dev with nothing configured, don't block the form.
    if (outcome.reason === "not-configured" && process.env.NODE_ENV !== "production") {
      console.warn("[Contact Form] No delivery channel configured; submission not sent.");
      return { success: true, errors: {} };
    }
    console.error("[Contact Form] Submission could not be delivered", outcome.reason);
    return {
      success: false,
      errors: {},
      formError: `We couldn't send your message. Please email ${siteConfig.email} directly.`,
    };
  }

  return { success: true, errors: {} };
}
