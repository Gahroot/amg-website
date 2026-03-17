"use client";

import { useState, useRef, useActionState } from "react";
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

export function ContactForm() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <ContactFormInner
      key={resetKey}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );
  const [clearedErrors, setClearedErrors] = useState<{
    fields: Set<string>;
    forState: ContactFormState;
  }>({ fields: new Set(), forState: initialState });

  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  function isErrorCleared(field: string) {
    return clearedErrors.forState === state && clearedErrors.fields.has(field);
  }

  function handleFieldChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name } = e.target;
    if (state.errors[name as keyof ContactFormState["errors"]] && !isErrorCleared(name)) {
      setClearedErrors((prev) => ({
        fields: new Set(prev.forState === state ? prev.fields : []).add(name),
        forState: state,
      }));
    }
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
          <div ref={leftRef} className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-6">
              <Mail className="size-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-tight mb-4">
              Thank You
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Your message has been received. We respond within 24 hours to all
              inquiries. A member of our team will reach out to begin your
              confidential discovery.
            </p>
            <Button variant="outline" onClick={onReset}>
              Send Another Message
            </Button>
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
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6">
              Begin Your Confidential Discovery
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Every engagement begins with a private, no-obligation discovery
              session. Tell us about your situation &mdash; we&apos;ll show you
              what integrated protection looks like.
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
            <form action={formAction} noValidate className="space-y-6">
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
                  onChange={handleFieldChange}
                  aria-invalid={
                    !!state.errors.name && !isErrorCleared("name")
                  }
                />
                {state.errors.name && !isErrorCleared("name") && (
                  <p className="text-sm text-destructive">
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
                  placeholder="Your organization"
                  onChange={handleFieldChange}
                  aria-invalid={
                    !!state.errors.organization &&
                    !isErrorCleared("organization")
                  }
                />
                {state.errors.organization &&
                  !isErrorCleared("organization") && (
                    <p className="text-sm text-destructive">
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
                  onChange={handleFieldChange}
                  aria-invalid={
                    !!state.errors.email && !isErrorCleared("email")
                  }
                />
                {state.errors.email && !isErrorCleared("email") && (
                  <p className="text-sm text-destructive">
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
                  onChange={handleFieldChange}
                />
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
                  onChange={handleFieldChange}
                  aria-invalid={
                    !!state.errors.message && !isErrorCleared("message")
                  }
                />
                {state.errors.message && !isErrorCleared("message") && (
                  <p className="text-sm text-destructive">
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
    </section>
  );
}
