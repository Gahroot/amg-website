"use client";

import { useState, useRef, useActionState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { siteConfig } from "@/lib/site-config";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/contact/actions";

const initialState: ContactFormState = { success: false, errors: {} };
const fieldLabels = {
  name: "Name",
  organization: "Organization",
  email: "Email",
  phone: "Phone",
  message: "Message",
} as const;

export function ContactForm() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <ContactFormInner
      key={resetKey}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}

export function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );
  const [values, setValues] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    message: "",
  });
  const [smsConsent, setSmsConsent] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const hasErrors = Object.keys(state.errors).length > 0;

  useEffect(() => {
    if (hasErrors || state.formError) errorSummaryRef.current?.focus();
  }, [state, hasErrors]);

  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  function handleFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reducedMotion) return;

      if (state.success) {
        if (leftRef.current) {
          gsap.fromTo(
            leftRef.current,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            },
          );
        }
        return;
      }

      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
        );
      }

      if (rightRef.current) {
        gsap.fromTo(
          rightRef.current,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
        );
      }
    },
    { scope: sectionRef, dependencies: [state.success] },
  );

  if (state.success) {
    return (
      <section ref={sectionRef} className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={leftRef} className="max-w-2xl mx-auto">
            <div className="bg-card border border-rule rounded-2xl p-10 lg:p-14 text-center">
              <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 mb-8">
                <Mail className="size-9 text-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                Thank You
              </h2>
              <p className="font-serif italic text-xl text-muted-foreground mb-4">
                Your inquiry is in trusted hands.
              </p>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Your inquiry has been received; no appointment has been booked.
                A member of our team will review your request and reach out
                within 24 hours to arrange your confidential discovery — in
                complete discretion.
              </p>
              <Button variant="outline" onClick={onReset}>
                Send Another Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
          {/* Left column — info */}
          <div ref={leftRef}>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              Get in Touch
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
              Begin Your Confidential Discovery
            </h1>
            <p className="font-serif italic text-xl text-muted-foreground mt-4 mb-6">
              Every great protection begins with a single, honest conversation.
            </p>
            <p className="text-muted-foreground text-lg mb-8">
              Every engagement begins with a private, no-obligation discovery
              session. Tell us about your situation &mdash; a member of our
              team will review your inquiry and follow up to arrange a conversation.
              Submitting this form does not book an appointment.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
            >
              <span className="inline-flex items-center justify-center size-10 rounded-full border border-border group-hover:border-primary transition-colors">
                <Mail className="size-4" />
              </span>
              <span className="font-mono text-sm">{siteConfig.email}</span>
            </a>
            <p className="text-muted-foreground text-sm mt-6">
              We respond within 24 hours to all inquiries.
            </p>
          </div>

          {/* Right column — form */}
          <div ref={rightRef}>
            <div className="bg-card/50 border border-rule rounded-2xl p-8 lg:p-10">
              <form
                action={formAction}
                noValidate
                className="space-y-8"
              >
                <p className="text-sm text-muted-foreground">
                  Name, organization, email and message are required. Phone and
                  text-message consent are optional. Minimum lengths exclude
                  surrounding spaces.
                </p>
                {(hasErrors || state.formError) && (
                  <div
                    ref={errorSummaryRef}
                    role="alert"
                    tabIndex={-1}
                    className="space-y-2 text-sm text-destructive rounded-md focus-visible:outline-2 focus-visible:outline-current"
                  >
                    {hasErrors && (
                      <>
                        <p>We couldn’t send your message. Review the fields below.</p>
                        <p>
                          Errors from your last submission stay visible while you
                          edit. Select a field below to correct it, then send your
                          message again to check your corrections.
                        </p>
                        <ul className="list-disc pl-5">
                          {Object.entries(fieldLabels).map(([field, label]) =>
                            state.errors[field as keyof typeof fieldLabels] ? (
                              <li key={field}>
                                <a
                                  href={`#${field}`}
                                  className="underline"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    document.getElementById(field)?.focus();
                                  }}
                                >
                                  Review {label}
                                </a>
                              </li>
                            ) : null,
                          )}
                        </ul>
                      </>
                    )}
                    {state.formError && <p>{state.formError}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="font-mono text-xs uppercase tracking-widest"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    required
                    minLength={2}
                    value={values.name}
                    onChange={handleFieldChange}
                    aria-describedby={`name-help${state.errors.name ? " name-error" : ""}`}
                    aria-invalid={!!state.errors.name}
                    className="bg-background h-12 px-4 focus-visible:ring-primary/50"
                  />
                  <p id="name-help" className="text-sm text-muted-foreground">
                    Required. At least 2 characters.
                  </p>
                  {state.errors.name && (
                    <p id="name-error" className="text-sm text-destructive">
                      {state.errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="organization"
                    className="font-mono text-xs uppercase tracking-widest"
                  >
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="Your organization or family name"
                    required
                    minLength={2}
                    value={values.organization}
                    onChange={handleFieldChange}
                    aria-describedby={`organization-help${state.errors.organization ? " organization-error" : ""}`}
                    aria-invalid={!!state.errors.organization}
                    className="bg-background h-12 px-4 focus-visible:ring-primary/50"
                  />
                  <p id="organization-help" className="text-sm text-muted-foreground">
                    Required. At least 2 characters. If contacting us as an
                    individual or family, enter “Individual” or your family name
                    (for example, “Doe family”).
                  </p>
                  {state.errors.organization && (
                    <p id="organization-error" className="text-sm text-destructive">
                      {state.errors.organization}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-mono text-xs uppercase tracking-widest"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={values.email}
                    onChange={handleFieldChange}
                    aria-describedby={`email-help${state.errors.email ? " email-error" : ""}`}
                    aria-invalid={!!state.errors.email}
                    className="bg-background h-12 px-4 focus-visible:ring-primary/50"
                  />
                  <p id="email-help" className="text-sm text-muted-foreground">
                    Required. Enter a valid email address, such as name@example.com.
                  </p>
                  {state.errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {state.errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="font-mono text-xs uppercase tracking-widest"
                  >
                    Phone{" "}
                    <span className="text-muted-foreground font-sans text-xs normal-case tracking-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={values.phone}
                    onChange={handleFieldChange}
                    className="bg-background h-12 px-4 focus-visible:ring-primary/50"
                  />
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      id="smsConsent"
                      name="smsConsent"
                      type="checkbox"
                      value="yes"
                      // Keep the reset default in sync with the visitor's choice.
                      defaultChecked={smsConsent}
                      onChange={(event) => setSmsConsent(event.target.checked)}
                      className="mt-1 size-4 shrink-0 cursor-pointer accent-primary"
                    />
                    <label
                      htmlFor="smsConsent"
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      By checking this box and providing my phone number, I agree
                      to receive recurring marketing and informational text messages
                      from Anchor Mill Group at the number provided. Consent is
                      not a condition of purchase. Message frequency varies.
                      Message &amp; data rates may apply. Reply STOP to opt out at
                      any time or HELP for help. See our Privacy Policy (
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        https://anchormillgroup.com/privacy
                      </Link>
                      ) and Terms of Service (
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        https://anchormillgroup.com/terms
                      </Link>
                      ).
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="font-mono text-xs uppercase tracking-widest"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your situation and how we can help..."
                    rows={5}
                    required
                    minLength={10}
                    value={values.message}
                    onChange={handleFieldChange}
                    aria-describedby={`message-help${state.errors.message ? " message-error" : ""}`}
                    aria-invalid={!!state.errors.message}
                    className="bg-background px-4 py-3 focus-visible:ring-primary/50"
                  />
                  <p id="message-help" className="text-sm text-muted-foreground">
                    Required. At least 10 characters.
                  </p>
                  {state.errors.message && (
                    <p id="message-error" className="text-sm text-destructive">
                      {state.errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Message"}
                  {!isPending && <ArrowRight className="size-4" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
