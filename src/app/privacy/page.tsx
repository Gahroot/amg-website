import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import {
  LegalPage,
  LegalSection,
} from "@/components/sections/legal/legal-page";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Anchor Mill Group, Inc. collects, uses, discloses, retains, and protects personal information in connection with our Services.",
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
          effectiveDate="May 13, 2025"
          lastUpdated="May 13, 2026"
          intro={`Anchor Mill Group, Inc. ("AMG," "we," "us," or "our") is a Delaware corporation providing integrated advisory services to ultra-high-net-worth individuals ("UHNWI"), family offices, and global executives. Our services span cybersecurity and executive protection, geopolitical risk and business intelligence, global transportation and logistics, leadership development and neurobiology, and integrative health and medicine.`}
        >
          <LegalSection id="introduction" number="01" title="Introduction and Scope">
            <p>
              This Privacy Policy (&ldquo;Policy&rdquo;) describes how AMG
              collects, uses, discloses, retains, and protects personal
              information in connection with our services, website
              (anchormillgroup.com), and all related platforms, communications,
              and engagements (collectively, the &ldquo;Services&rdquo;).
            </p>
            <p>
              By engaging AMG&apos;s Services, you acknowledge that you have
              read and understood this Policy. If you do not agree with this
              Policy, do not use our Services or submit personal information to
              us.
            </p>
          </LegalSection>

          <LegalSection id="information" number="02" title="Information We Collect">
            <p>
              <strong className="text-foreground">
                2.1 Information You Provide Directly.
              </strong>{" "}
              We collect information you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Inquire about or engage our Services</li>
              <li>
                Execute service agreements, statements of work, or consulting
                engagements
              </li>
              <li>
                Communicate with us via email, phone, or secure messaging
                platforms
              </li>
              <li>
                Complete assessments, intake questionnaires, or due diligence
                forms
              </li>
              <li>Attend events, briefings, or AMG-facilitated sessions</li>
            </ul>
            <p>
              This information may include: full legal name, title, and
              organization; contact details (address, phone, email); financial
              profile data and asset structure information; biographical,
              family, and household information relevant to risk assessment;
              health and medical information disclosed in connection with
              integrative health services; travel preferences, schedules, and
              itineraries; and government-issued identification where legally
              required.
            </p>
            <p>
              <strong className="text-foreground">
                2.2 Information Collected Automatically.
              </strong>{" "}
              When you access our website or digital platforms, we may
              automatically collect: IP address and general geolocation data;
              browser type, device identifiers, and operating system; pages
              visited, time spent, and navigation patterns; and referral source
              and session duration data. We use cookies and similar tracking
              technologies only to the extent necessary for secure access and
              service functionality. We do not deploy third-party advertising
              trackers.
            </p>
            <p>
              <strong className="text-foreground">
                2.3 Information Collected from Third Parties.
              </strong>{" "}
              In the course of delivering Services, AMG may receive
              information about you from: referring advisors, family office
              personnel, or legal counsel; open-source intelligence (OSINT)
              collection relevant to threat assessments; financial
              institutions, custodians, or counterparties in connection with
              logistics or advisory engagements; and public records, corporate
              registries, and regulatory databases.
            </p>
            <p>
              <strong className="text-foreground">
                2.4 Sensitive Personal Information.
              </strong>{" "}
              AMG&apos;s service model may require collection of sensitive
              personal information, including health and medical records (in
              connection with AMG Health services), financial account and
              wealth data, security posture and physical protection details,
              biometric identifiers (where applicable and consented to), and
              information about minor dependents when relevant to principal
              protection engagements. Sensitive information is subject to
              heightened protection protocols as described in Section 5 below.
            </p>
          </LegalSection>

          <LegalSection id="use" number="03" title="How We Use Your Information">
            <p>
              AMG uses personal information strictly for the following
              purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Service Delivery:</strong>{" "}
                To provide, customize, and improve the advisory services
                outlined in your engagement agreement.
              </li>
              <li>
                <strong className="text-foreground">
                  Risk Assessment and Intelligence:
                </strong>{" "}
                To conduct threat assessments, due diligence, and geopolitical
                analysis relevant to your principal and organizational risk
                profile.
              </li>
              <li>
                <strong className="text-foreground">Communications:</strong>{" "}
                To respond to inquiries, deliver reports and briefings, and
                maintain client correspondence.
              </li>
              <li>
                <strong className="text-foreground">
                  Compliance and Legal Obligations:
                </strong>{" "}
                To satisfy applicable legal, regulatory, and contractual
                requirements, including anti-money laundering (AML),
                know-your-customer (KYC), and export control obligations.
              </li>
              <li>
                <strong className="text-foreground">Security:</strong> To
                protect AMG&apos;s systems, personnel, and clients from fraud,
                unauthorized access, and cybersecurity threats.
              </li>
              <li>
                <strong className="text-foreground">
                  Business Operations:
                </strong>{" "}
                For internal record-keeping, billing, quality assurance, and
                service continuity planning.
              </li>
            </ul>
            <p>
              AMG does not sell, rent, or license your personal information for
              commercial or marketing purposes.
            </p>
          </LegalSection>

          <LegalSection
            id="disclosure"
            number="04"
            title="Disclosure of Your Information"
          >
            <p>
              <strong className="text-foreground">
                4.1 Service Partners and Subcontractors.
              </strong>{" "}
              AMG operates through a curated ecosystem of domain experts. We
              may share your information with vetted partner firms and
              subcontractors who provide services under AMG&apos;s direction
              and under confidentiality obligations no less protective than
              this Policy. All third-party partners are contractually bound to
              use your information solely to perform services on AMG&apos;s
              behalf.
            </p>
            <p>
              <strong className="text-foreground">
                4.2 Legal Compulsion.
              </strong>{" "}
              We may disclose personal information if required by law,
              subpoena, court order, or government authority, or if we
              determine in good faith that disclosure is necessary to prevent
              fraud, protect AMG&apos;s legal rights, or protect the safety of
              any person.
            </p>
            <p>
              <strong className="text-foreground">
                4.3 Corporate Transactions.
              </strong>{" "}
              In the event of a merger, acquisition, restructuring, or sale of
              substantially all of AMG&apos;s assets, personal information may
              be transferred as part of that transaction. We will notify
              affected clients of any such transfer and any material changes
              to data handling practices.
            </p>
            <p>
              <strong className="text-foreground">
                4.4 Consent-Based Disclosure.
              </strong>{" "}
              We may share your information with third parties not described
              above when you have given us explicit, documented consent to do
              so.
            </p>
            <p>
              <strong className="text-foreground">
                4.5 Aggregate and De-Identified Data.
              </strong>{" "}
              We may use and disclose aggregated, anonymized, or de-identified
              information that cannot reasonably be used to identify you for
              research, service improvement, and industry analysis purposes.
            </p>
          </LegalSection>

          <LegalSection
            id="security"
            number="05"
            title="Data Security and Confidentiality"
          >
            <p>
              Given the nature of our clientele and the sensitivity of
              information we handle, AMG maintains security standards
              commensurate with UHNWI-level principal protection. Our
              information security program includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                End-to-end encryption for digital communications and file
                transfers
              </li>
              <li>
                Access controls with role-based permissions and multi-factor
                authentication
              </li>
              <li>
                Secure physical storage and handling protocols for non-digital
                records
              </li>
              <li>
                Vendor due diligence and cybersecurity assessments for all
                technology partners
              </li>
              <li>Incident response and breach notification procedures</li>
              <li>
                Regular security assessments conducted by our cybersecurity
                practice
              </li>
            </ul>
            <p>
              Notwithstanding our security measures, no system is completely
              immune to breach. AMG will notify affected clients without undue
              delay in the event of a data breach that may compromise your
              personal information, to the extent required by applicable law.
            </p>
          </LegalSection>

          <LegalSection id="retention" number="06" title="Data Retention">
            <p>
              AMG retains personal information for as long as necessary to
              fulfill the purposes described in this Policy and to comply with
              applicable legal, regulatory, and contractual obligations.
              Retention periods are determined based on:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The duration of the client engagement plus a minimum
                post-engagement period of seven (7) years for financial and
                advisory records
              </li>
              <li>Applicable statutes of limitations for legal claims</li>
              <li>
                Regulatory requirements including AML, tax, and professional
                licensing obligations
              </li>
              <li>
                The ongoing necessity of data to protect client safety and
                security
              </li>
            </ul>
            <p>
              Upon expiration of the applicable retention period, or upon
              verified client request (subject to legal hold obligations), AMG
              will securely destroy or de-identify personal information through
              certified data destruction procedures.
            </p>
          </LegalSection>

          <LegalSection
            id="transfers"
            number="07"
            title="Cross-Border Data Transfers"
          >
            <p>
              AMG operates across multiple jurisdictions, including the United
              States, Puerto Rico, and international geographies. Personal
              information may be transferred to, stored, and processed in
              jurisdictions outside your country of residence, including
              jurisdictions that may not provide the same level of data
              protection as your home jurisdiction. Where required by law, AMG
              will implement appropriate transfer mechanisms, including
              standard contractual clauses or binding corporate rules, to
              protect your information in cross-border transfers.
            </p>
          </LegalSection>

          <LegalSection id="rights" number="08" title="Your Privacy Rights">
            <p>
              Depending on your jurisdiction of residence, you may have certain
              rights with respect to your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Right of Access:</strong>{" "}
                To request a copy of personal information we hold about you
              </li>
              <li>
                <strong className="text-foreground">
                  Right to Correction:
                </strong>{" "}
                To request correction of inaccurate or incomplete information
              </li>
              <li>
                <strong className="text-foreground">Right to Deletion:</strong>{" "}
                To request deletion of your personal information, subject to
                legal retention obligations
              </li>
              <li>
                <strong className="text-foreground">
                  Right to Restrict Processing:
                </strong>{" "}
                To request that we limit how we use your information
              </li>
              <li>
                <strong className="text-foreground">
                  Right to Data Portability:
                </strong>{" "}
                To receive your information in a structured, machine-readable
                format
              </li>
              <li>
                <strong className="text-foreground">Right to Object:</strong>{" "}
                To object to certain processing activities, including
                profiling
              </li>
              <li>
                <strong className="text-foreground">
                  Right to Withdraw Consent:
                </strong>{" "}
                Where processing is based on consent, to withdraw consent at
                any time without affecting the lawfulness of prior processing
              </li>
            </ul>
            <p>
              To exercise any of these rights, submit a written request to
              AMG&apos;s Privacy Contact (see Section 11). We will respond
              within thirty (30) days of receipt of a verified request. We may
              require identity verification before processing access or
              deletion requests.
            </p>
            <p>
              <strong className="text-foreground">
                California Residents:
              </strong>{" "}
              If you are a California resident, you may have additional rights
              under the California Consumer Privacy Act (CCPA) and the
              California Privacy Rights Act (CPRA), including the right to
              know, delete, correct, and opt out of the sale or sharing of
              personal information. AMG does not sell personal information as
              defined under California law.
            </p>
          </LegalSection>

          <LegalSection
            id="cookies"
            number="09"
            title="Cookies and Tracking Technologies"
          >
            <p>
              AMG&apos;s website uses a minimal set of cookies necessary for
              secure site functionality and analytics. We do not deploy
              third-party advertising cookies or cross-site tracking
              technologies. You may configure your browser to block or delete
              cookies; however, this may affect certain site functionality.
            </p>
            <p>Types of cookies we use:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">
                  Strictly Necessary Cookies:
                </strong>{" "}
                Required for secure login, session management, and basic site
                function
              </li>
              <li>
                <strong className="text-foreground">Analytics Cookies:</strong>{" "}
                Used to understand site usage in aggregate, with no individual
                tracking or sale of data
              </li>
            </ul>
            <p>
              We do not respond to &ldquo;Do Not Track&rdquo; signals at this
              time, as there is no widely accepted standard for such signals.
            </p>
          </LegalSection>

          <LegalSection id="children" number="10" title="Children’s Privacy">
            <p>
              AMG&apos;s Services are directed to adults and sophisticated
              institutional clients. We do not knowingly collect personal
              information from individuals under the age of thirteen (13). If
              we become aware that we have inadvertently collected personal
              information from a child, we will take immediate steps to delete
              that information. Information about minor dependents collected
              in connection with principal protection engagements is handled
              under strict need-to-know protocols.
            </p>
          </LegalSection>

          <LegalSection
            id="contact"
            number="11"
            title="Privacy Contact and Complaints"
          >
            <p>
              For privacy inquiries, rights requests, or complaints, contact
              AMG&apos;s designated Privacy Contact at:
            </p>
            <div className="border-l-2 border-rule pl-6 py-2 space-y-1">
              <p>
                <strong className="text-foreground">
                  Anchor Mill Group, Inc.
                </strong>
              </p>
              <p>Attn: Privacy Officer</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:inquiries@anchormillgroup.com"
                  className="text-primary hover:underline"
                >
                  inquiries@anchormillgroup.com
                </a>
              </p>
              <p>Web: anchormillgroup.com</p>
            </div>
            <p>
              We will acknowledge receipt of privacy complaints within five (5)
              business days and aim to resolve all complaints within thirty
              (30) days. If you are not satisfied with our response, you may
              have the right to lodge a complaint with the applicable data
              protection supervisory authority in your jurisdiction.
            </p>
          </LegalSection>

          <LegalSection id="changes" number="12" title="Changes to This Policy">
            <p>
              AMG reserves the right to update this Privacy Policy at any
              time. Material changes will be communicated to active clients
              via written notice or email at least thirty (30) days prior to
              the effective date of the change. The current version of this
              Policy, along with its effective date, will always be available
              at anchormillgroup.com. Continued use of our Services following
              notice of a material change constitutes acceptance of the
              revised Policy.
            </p>
          </LegalSection>

          <LegalSection id="governing-law" number="13" title="Governing Law">
            <p>
              This Privacy Policy is governed by and construed in accordance
              with the laws of the State of Delaware, without regard to its
              conflict of law provisions. Disputes arising under this Policy
              shall be subject to the exclusive jurisdiction of the courts of
              the State of Delaware or, where applicable, the federal courts
              located in the District of Delaware.
            </p>
          </LegalSection>
        </LegalPage>
      </main>
      <Footer />
    </>
  );
}
