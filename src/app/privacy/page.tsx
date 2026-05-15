import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import {
  LegalPage,
  LegalSection,
} from "@/components/sections/legal/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Anchor Mill Group collects, uses, and protects personal information shared through our website and client engagements.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <LegalPage
          eyebrow="Legal"
          title="Privacy Policy"
          effectiveDate="January 1, 2026"
          intro="Anchor Mill Group Inc. (“AMG,” “we,” “our,” or “us”) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard information about visitors to anchormillgroup.com (the “Site”) and individuals who engage with us regarding our services."
        >
          <LegalSection id="scope" number="01" title="Scope">
            <p>
              This Policy applies to personal information processed through the
              Site, our contact forms, email correspondence, and prospective
              engagement discussions. It does not apply to information governed
              by a separate written engagement agreement or to third-party
              websites linked from the Site.
            </p>
          </LegalSection>

          <LegalSection id="information" number="02" title="Information We Collect">
            <p>
              <strong className="text-foreground">
                Information you provide.
              </strong>{" "}
              When you complete a contact form, request a consultation, or
              correspond with us, we may collect your name, email address,
              phone number, organization, role, and the substance of your
              inquiry.
            </p>
            <p>
              <strong className="text-foreground">
                Automatically collected information.
              </strong>{" "}
              Our hosting and analytics providers may collect technical data
              such as IP address, device and browser type, referring URLs,
              pages viewed, and timestamps. We use privacy-respecting analytics
              and do not deploy advertising trackers.
            </p>
            <p>
              <strong className="text-foreground">Cookies.</strong> The Site
              uses strictly necessary cookies for theme preferences and basic
              functionality. We do not use third-party advertising cookies.
            </p>
          </LegalSection>

          <LegalSection id="use" number="03" title="How We Use Information">
            <p>We use personal information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to inquiries and evaluate prospective engagements;</li>
              <li>Communicate about our services, events, and insights;</li>
              <li>
                Operate, secure, and improve the Site and our communications;
              </li>
              <li>
                Comply with legal obligations, including anti-money-laundering,
                sanctions, and know-your-client requirements; and
              </li>
              <li>Protect our rights, clients, personnel, and property.</li>
            </ul>
          </LegalSection>

          <LegalSection id="basis" number="04" title="Legal Bases (EEA/UK)">
            <p>
              Where the GDPR or UK GDPR applies, we process personal
              information on the bases of: (i) your consent; (ii) the
              performance of a contract or steps taken at your request prior to
              entering into a contract; (iii) compliance with legal
              obligations; and (iv) our legitimate interests in operating and
              securing our business, balanced against your rights.
            </p>
          </LegalSection>

          <LegalSection id="sharing" number="05" title="How We Share Information">
            <p>
              We do not sell personal information. We share it only with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Service providers</strong>{" "}
                that host our Site, deliver email, provide analytics, and
                support our operations under confidentiality and data-protection
                obligations;
              </li>
              <li>
                <strong className="text-foreground">Professional advisors</strong>{" "}
                including counsel, auditors, and compliance specialists;
              </li>
              <li>
                <strong className="text-foreground">Regulators and authorities</strong>{" "}
                where required by law or to protect legal rights; and
              </li>
              <li>
                <strong className="text-foreground">
                  Successors in interest
                </strong>{" "}
                in connection with a corporate transaction, subject to
                continued protection of your information.
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="transfers" number="06" title="International Transfers">
            <p>
              AMG serves a global clientele. Personal information may be
              processed in jurisdictions outside your country of residence,
              including the United States. Where required, we rely on
              appropriate safeguards such as standard contractual clauses.
            </p>
          </LegalSection>

          <LegalSection id="retention" number="07" title="Retention">
            <p>
              We retain personal information only as long as necessary for the
              purposes described in this Policy, to comply with legal and
              regulatory obligations, to resolve disputes, and to enforce our
              agreements. Inquiry records that do not result in an engagement
              are retained for a reasonable period and then deleted or
              anonymized.
            </p>
          </LegalSection>

          <LegalSection id="security" number="08" title="Security">
            <p>
              We maintain administrative, technical, and physical safeguards
              designed to protect personal information against unauthorized
              access, alteration, disclosure, or destruction. No method of
              transmission or storage is fully secure; you share information
              with us at your own risk and should not send sensitive material
              via unencrypted email.
            </p>
          </LegalSection>

          <LegalSection id="rights" number="09" title="Your Rights">
            <p>
              Depending on your jurisdiction, you may have the right to access,
              correct, delete, restrict, or object to our processing of your
              personal information, to withdraw consent, to receive a portable
              copy of your data, and to lodge a complaint with a supervisory
              authority. To exercise these rights, contact us at{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:underline"
              >
                {siteConfig.email}
              </a>
              . We will respond consistent with applicable law.
            </p>
            <p>
              <strong className="text-foreground">
                California residents.
              </strong>{" "}
              We do not sell or share personal information as those terms are
              defined under the CCPA/CPRA. You may request access or deletion
              of your personal information using the contact details above.
            </p>
          </LegalSection>

          <LegalSection id="children" number="10" title="Children">
            <p>
              The Site is intended for a professional audience and is not
              directed to children under 16. We do not knowingly collect
              personal information from children.
            </p>
          </LegalSection>

          <LegalSection id="changes" number="11" title="Changes to This Policy">
            <p>
              We may update this Policy from time to time. Material changes
              will be reflected by updating the Effective date above and, where
              appropriate, by additional notice. Continued use of the Site
              following any update constitutes acceptance of the revised
              Policy.
            </p>
          </LegalSection>

          <LegalSection id="contact" number="12" title="Contact">
            <p>
              Questions about this Policy or our privacy practices may be sent
              to{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:underline"
              >
                {siteConfig.email}
              </a>{" "}
              or via our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>
              .
            </p>
          </LegalSection>
        </LegalPage>
      </main>
      <Footer />
    </>
  );
}
