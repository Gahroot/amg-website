"use client";

import { useRef } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who is AMG designed for?",
    answer:
      "AMG serves UHNW families ($100M+ net worth), family offices ($250M+ AUM), and global executives who face complex, multi-domain threats and need integrated protection.",
  },
  {
    question: "How does the discovery process work?",
    answer:
      "We begin with a confidential conversation to understand your situation. From there, we conduct a comprehensive cross-domain assessment and deliver a unified strategic blueprint.",
  },
  {
    question: "What makes AMG different from traditional security firms?",
    answer:
      "Traditional firms address one domain in isolation. AMG integrates five domains \u2014 neurobiology, cybersecurity, leadership, medicine, and intelligence \u2014 under one strategic layer.",
  },
  {
    question: "How long does an engagement typically take?",
    answer:
      "Initial discovery and blueprint development takes 4-6 weeks. Ongoing support is continuous and adapts to your evolving needs.",
  },
  {
    question: "Is my information kept confidential?",
    answer:
      "Absolute discretion is foundational to everything we do. All communications and client information are protected under strict confidentiality protocols.",
  },
  {
    question: "Can we start with just one domain?",
    answer:
      "Yes. While our integrated approach is most powerful, clients can begin with two or more domains and expand as needs evolve.",
  },
];

export function ContactFAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion) return;

      const targets = [headerRef.current, accordionRef.current].filter(
        Boolean
      ) as HTMLElement[];
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-card/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef}>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            Frequently Asked Questions
          </p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-12">
            Common Questions
          </h2>
        </div>

        <div ref={accordionRef}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="font-serif text-lg text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
