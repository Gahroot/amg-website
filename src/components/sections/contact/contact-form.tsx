"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";
import { siteConfig } from "@/lib/site-config";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().min(2, "Organization is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide more detail"),
});

type ContactFormData = z.infer<typeof contactSchema>;

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    organization: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion) return;

      if (submitted) {
        // Simple fade-up for the success state
        if (leftRef.current) {
          gsap.fromTo(
            leftRef.current,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            }
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
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
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
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (sectionRef.current?.contains(st.trigger as Element)) st.kill();
        });
      };
    },
    { scope: sectionRef, dependencies: [submitted] }
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
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
              Your message has been received. We respond within 24 hours to
              all inquiries. A member of our team will reach out to begin your
              confidential discovery.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  organization: "",
                  email: "",
                  phone: "",
                  message: "",
                });
                setErrors({});
              }}
            >
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
              session. Tell us about your situation &mdash; we&apos;ll show
              you what integrated protection looks like.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
            >
              <span className="inline-flex items-center justify-center size-10 rounded-full border border-border group-hover:border-primary transition-colors">
                <Mail className="size-4" />
              </span>
              <span className="font-mono text-sm">
                {siteConfig.email}
              </span>
            </a>
            <p className="text-muted-foreground text-sm mt-6">
              We respond within 24 hours to all inquiries.
            </p>
          </div>

          {/* Right column — form */}
          <div ref={rightRef}>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-xs uppercase tracking-widest">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="font-mono text-xs uppercase tracking-widest">
                  Organization
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  placeholder="Your organization"
                  value={formData.organization}
                  onChange={handleChange}
                  aria-invalid={!!errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-destructive">
                    {errors.organization}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-mono text-xs uppercase tracking-widest">
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
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-mono text-xs uppercase tracking-widest">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your situation and how we can help..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Send Message
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
