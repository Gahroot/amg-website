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
  title: "Terms of Service",
  description:
    "Terms governing your use of the Anchor Mill Group website and related communications.",
};

export default function TermsPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <LegalPage
          eyebrow="Legal"
          title="Terms of Service"
          effectiveDate="January 1, 2026"
          intro="These Terms of Service (“Terms”) govern your access to and use of anchormillgroup.com and any related content, forms, and communications (collectively, the “Site”) provided by Anchor Mill Group Inc. (“AMG,” “we,” “our,” or “us”). By using the Site, you agree to these Terms."
        >
          <LegalSection id="acceptance" number="01" title="Acceptance of Terms">
            <p>
              By accessing or using the Site, you confirm that you have read,
              understood, and agree to be bound by these Terms and our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              . If you do not agree, you must not use the Site.
            </p>
          </LegalSection>

          <LegalSection
            id="no-advice"
            number="02"
            title="Informational Purposes; No Advice"
          >
            <p>
              The Site is provided for general informational purposes only.
              Content on the Site does not constitute legal, tax, accounting,
              investment, insurance, security, or other professional advice and
              should not be relied upon as such. No client, fiduciary,
              advisory, or other professional relationship is created by your
              use of the Site or by submitting an inquiry.
            </p>
            <p>
              Any engagement of AMG&apos;s services is governed solely by a
              separate, signed engagement agreement. In the event of any
              conflict between these Terms and a signed engagement agreement,
              the engagement agreement controls with respect to that
              engagement.
            </p>
          </LegalSection>

          <LegalSection
            id="no-solicitation"
            number="03"
            title="No Solicitation or Offer"
          >
            <p>
              Nothing on the Site constitutes an offer to sell, or a
              solicitation of an offer to buy, any security, insurance product,
              or service in any jurisdiction where such an offer or
              solicitation would be unlawful. AMG does not provide services to
              persons in jurisdictions where doing so would violate applicable
              law.
            </p>
          </LegalSection>

          <LegalSection id="eligibility" number="04" title="Eligibility">
            <p>
              The Site is intended for a professional audience including family
              offices, ultra-high-net-worth individuals and families, and
              executive leaders. By using the Site you represent that you are
              at least the age of majority in your jurisdiction and have the
              authority to enter into these Terms on your own behalf or on
              behalf of the entity you represent.
            </p>
          </LegalSection>

          <LegalSection id="acceptable-use" number="05" title="Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Use the Site in any manner that violates applicable law or
                regulation;
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the Site,
                related systems, or other users&apos; data;
              </li>
              <li>
                Interfere with, disrupt, or impose an unreasonable load on the
                Site or its infrastructure;
              </li>
              <li>
                Use any automated means (including scrapers, crawlers, or bots)
                to access the Site except for publicly available indexing by
                reputable search engines;
              </li>
              <li>
                Reverse engineer, decompile, or otherwise attempt to derive the
                source code of any software made available on the Site; or
              </li>
              <li>
                Submit content that is unlawful, infringing, defamatory, or
                that you do not have the right to provide.
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="ip" number="06" title="Intellectual Property">
            <p>
              The Site and its contents — including text, graphics, logos,
              imagery, design, and software — are owned by AMG or its
              licensors and are protected by intellectual-property laws. We
              grant you a limited, revocable, non-exclusive, non-transferable
              license to access and view the Site for your personal,
              non-commercial use. All other rights are reserved.
            </p>
            <p>
              &ldquo;Anchor Mill Group&rdquo; and associated marks and logos
              are trademarks of AMG. You may not use them without our prior
              written consent.
            </p>
          </LegalSection>

          <LegalSection id="submissions" number="07" title="Submissions">
            <p>
              Any information you submit through the Site&apos;s contact forms
              or by email — other than personal information governed by our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              — is provided on a non-confidential basis. You grant AMG a
              non-exclusive, royalty-free, worldwide license to use such
              non-personal submissions for the purpose of responding to your
              inquiry and improving our services. Do not submit confidential
              or sensitive material through the Site.
            </p>
          </LegalSection>

          <LegalSection
            id="third-party"
            number="08"
            title="Third-Party Content and Links"
          >
            <p>
              The Site may contain links to third-party websites or resources.
              We do not control and are not responsible for the content,
              accuracy, or practices of any third party. Inclusion of a link
              does not imply endorsement.
            </p>
          </LegalSection>

          <LegalSection id="disclaimer" number="09" title="Disclaimer of Warranties">
            <p>
              THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND
              &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND,
              WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT
              LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, OR UNINTERRUPTED
              OPERATION. AMG DOES NOT WARRANT THAT THE SITE WILL BE SECURE,
              ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
            </p>
          </LegalSection>

          <LegalSection
            id="liability"
            number="10"
            title="Limitation of Liability"
          >
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, AMG AND ITS AFFILIATES,
              OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY,
              OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUES, DATA,
              GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING
              TO YOUR USE OF, OR INABILITY TO USE, THE SITE. AMG&apos;S
              AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THE SITE SHALL
              NOT EXCEED ONE HUNDRED U.S. DOLLARS (US$100).
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot
              be excluded or limited under applicable law.
            </p>
          </LegalSection>

          <LegalSection id="indemnity" number="11" title="Indemnification">
            <p>
              You agree to indemnify and hold harmless AMG and its affiliates,
              officers, directors, employees, and agents from and against any
              claims, liabilities, damages, losses, and expenses (including
              reasonable attorneys&apos; fees) arising out of or related to
              your use of the Site, your violation of these Terms, or your
              violation of any rights of a third party.
            </p>
          </LegalSection>

          <LegalSection id="termination" number="12" title="Termination">
            <p>
              We may suspend or terminate your access to the Site at any time,
              with or without notice, for any reason, including suspected
              violation of these Terms. Sections of these Terms that by their
              nature should survive termination will survive.
            </p>
          </LegalSection>

          <LegalSection
            id="governing-law"
            number="13"
            title="Governing Law and Disputes"
          >
            <p>
              These Terms are governed by the laws of the State of Delaware,
              United States, without regard to its conflict-of-laws principles.
              Any dispute arising out of or relating to these Terms or the
              Site shall be brought exclusively in the state or federal courts
              located in Delaware, and you consent to the personal jurisdiction
              of such courts. The United Nations Convention on Contracts for
              the International Sale of Goods does not apply.
            </p>
          </LegalSection>

          <LegalSection id="changes" number="14" title="Changes to These Terms">
            <p>
              We may modify these Terms at any time. Material changes will be
              reflected by updating the Effective date above. Your continued
              use of the Site after any such update constitutes acceptance of
              the revised Terms.
            </p>
          </LegalSection>

          <LegalSection id="miscellaneous" number="15" title="Miscellaneous">
            <p>
              These Terms, together with our Privacy Policy and any signed
              engagement agreement, constitute the entire agreement between
              you and AMG regarding the Site. If any provision is held
              unenforceable, the remaining provisions will remain in full
              force and effect. Our failure to enforce any provision shall not
              constitute a waiver. You may not assign these Terms without our
              prior written consent.
            </p>
          </LegalSection>

          <LegalSection id="contact" number="16" title="Contact">
            <p>
              Questions about these Terms may be sent to{" "}
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
