import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - LuxWeb Studio",
  description: "How LuxWeb Studio collects, uses, and protects information from visitors and clients of luxwebstudio.dev.",
  openGraph: {
    title: "Privacy Policy - LuxWeb Studio",
    description: "How LuxWeb Studio collects, uses, and protects information from visitors and clients.",
    url: "/privacy",
  },
}

const EFFECTIVE_DATE = "May 14, 2026"
const LAST_UPDATED = "May 14, 2026"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <article className="container mx-auto max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Effective Date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last Updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            LuxWeb Studio (&ldquo;LuxWeb Studio,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) operates the website{" "}
            <a
              href="https://luxwebstudio.dev"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              luxwebstudio.dev
            </a>{" "}
            (the &ldquo;Site&rdquo;). This Privacy Policy explains what information we collect
            from visitors and clients, how we use it, and the choices you have.
          </p>
          <p>
            By using the Site or our services, you agree to the practices described here. If you
            do not agree, please do not use the Site.
          </p>

          <Section heading="1. Information We Collect">
            <SubHeading>a. Information you provide</SubHeading>
            <p>
              We collect the information you submit through our contact form, AI chat assistant,
              or email, which may include:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Company name (optional)</li>
              <li>Project type or service of interest</li>
              <li>The message or project details you share with us</li>
              <li>Any other information you choose to include in your inquiry or chat</li>
            </ul>

            <SubHeading>b. AI chat conversations</SubHeading>
            <p>
              The Site includes an AI-powered chat assistant. Messages you send through the chat
              are processed by our AI provider (Anthropic, makers of Claude) to generate
              responses. Conversation contents may be stored in our database so we can follow up
              with you and improve the service.
            </p>

            <SubHeading>c. Automatically collected information</SubHeading>
            <p>When you visit the Site, our hosting and analytics providers may automatically collect:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>IP address and approximate location</li>
              <li>Browser type, device type, and operating system</li>
              <li>Pages viewed, time on page, and referring URLs</li>
              <li>Performance and diagnostic data</li>
            </ul>
            <p>
              This data is collected through cookies, log files, and similar technologies via
              services such as Vercel Analytics and Vercel Speed Insights.
            </p>
          </Section>

          <Section heading="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>Respond to your inquiries and prepare project quotes</li>
              <li>Provide, maintain, and improve our services</li>
              <li>
                Send transactional or service-related communications (e.g., confirmation emails,
                AI-generated auto-replies, project updates)
              </li>
              <li>Operate, analyze, and secure the Site</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud, spam, and abuse</li>
            </ul>
            <p>
              <strong className="font-semibold text-white">We do not sell your personal information.</strong>
            </p>
          </Section>

          <Section heading="3. How We Share Your Information">
            <p>
              We share information only with the following categories of recipients, each used to
              run our business or deliver services to you:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2">
              <li>
                <strong className="font-semibold text-white">LuxWeb CRM</strong> (
                <em>portal.luxwebstudio.dev</em>) — our own internal lead and project management
                system. Contact form submissions are forwarded to the CRM so we can respond and
                follow up.
              </li>
              <li>
                <strong className="font-semibold text-white">Supabase</strong> — database storage
                for contact submissions and chat history.
              </li>
              <li>
                <strong className="font-semibold text-white">Vercel</strong> — hosting,
                deployment, analytics, and performance monitoring.
              </li>
              <li>
                <strong className="font-semibold text-white">Anthropic</strong> — AI processing
                for our chat assistant and AI-generated reply features.
              </li>
              <li>
                <strong className="font-semibold text-white">Resend</strong> — transactional
                email delivery (e.g., contact confirmations and auto-replies).
              </li>
              <li>
                <strong className="font-semibold text-white">Professional advisors</strong> such
                as accountants and lawyers, where reasonably necessary.
              </li>
              <li>
                <strong className="font-semibold text-white">Authorities</strong>, when required
                by law, subpoena, or to protect the rights, property, or safety of LuxWeb Studio
                or others.
              </li>
            </ul>
            <p>
              Each provider is bound by its own terms and privacy practices. Where applicable,
              data may be transferred to and processed in the United States.
            </p>
          </Section>

          <Section heading="4. Cookies and Tracking">
            <p>The Site uses a minimal number of cookies and similar technologies, primarily for:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>Maintaining session state and basic functionality</li>
              <li>Anonymous usage analytics and performance monitoring</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Disabling cookies may affect
              Site functionality.
            </p>
          </Section>

          <Section heading="5. Data Retention">
            <p>We retain personal information for as long as needed to:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>Respond to your inquiry and provide requested services</li>
              <li>Maintain client and project records</li>
              <li>Comply with legal, tax, and accounting requirements</li>
            </ul>
            <p>When information is no longer needed for these purposes, we delete or anonymize it.</p>
          </Section>

          <Section heading="6. Your Rights and Choices">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li><strong className="font-semibold text-white">Access</strong> the personal information we hold about you</li>
              <li><strong className="font-semibold text-white">Correct</strong> inaccurate or incomplete information</li>
              <li><strong className="font-semibold text-white">Delete</strong> your personal information</li>
              <li><strong className="font-semibold text-white">Object to</strong> or <strong className="font-semibold text-white">restrict</strong> certain processing</li>
              <li><strong className="font-semibold text-white">Withdraw consent</strong> where processing is based on consent</li>
              <li><strong className="font-semibold text-white">Opt out</strong> of marketing communications at any time</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:support@luxwebstudio.dev"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                support@luxwebstudio.dev
              </a>
              . We will respond within a reasonable timeframe and in accordance with applicable law.
            </p>
            <p>
              <strong className="font-semibold text-white">California residents:</strong> Under
              the California Consumer Privacy Act (CCPA), you have additional rights, including
              the right to know what personal information we collect and to request deletion. We
              do not sell personal information.
            </p>
            <p>
              <strong className="font-semibold text-white">EU/UK residents:</strong> Under the
              GDPR/UK GDPR, you have rights to access, correct, delete, and port your data, and to
              lodge a complaint with your local supervisory authority.
            </p>
          </Section>

          <Section heading="7. Data Security">
            <p>
              We use reasonable administrative, technical, and physical safeguards to protect your
              information, including encryption in transit (HTTPS), access controls on our
              database, and limited employee access to personal data. No method of transmission or
              storage is 100% secure, however, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section heading="8. Children's Privacy">
            <p>
              The Site is not directed to children under 13, and we do not knowingly collect
              personal information from children under 13. If you believe a child has provided us
              with personal information, please contact us and we will delete it.
            </p>
          </Section>

          <Section heading="9. Third-Party Links">
            <p>
              The Site may contain links to third-party websites. We are not responsible for the
              privacy practices of those sites, and we encourage you to review their policies.
            </p>
          </Section>

          <Section heading="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last Updated&rdquo;
              date at the top of this page reflects the most recent revision. Material changes
              will be communicated by updating this page and, where appropriate, by additional
              notice.
            </p>
          </Section>

          <Section heading="11. Contact Us">
            <p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mt-3">
              <p className="m-0"><strong className="font-semibold text-white">LuxWeb Studio</strong></p>
              <p className="m-0">
                Email:{" "}
                <a
                  href="mailto:support@luxwebstudio.dev"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  support@luxwebstudio.dev
                </a>
              </p>
              <p className="m-0">
                Phone:{" "}
                <a href="tel:+17186350736" className="text-purple-400 hover:text-purple-300 underline">
                  (718) 635-0736
                </a>
              </p>
              <p className="m-0">Website: luxwebstudio.dev</p>
            </div>
          </Section>

          <div className="pt-8 border-t border-white/10 mt-12 text-sm text-gray-500">
            <p>
              See also our{" "}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="pt-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-white mt-4 mb-4">{heading}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-white mt-4">{children}</h3>
}
