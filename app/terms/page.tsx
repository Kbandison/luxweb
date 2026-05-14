import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service - LuxWeb Studio",
  description: "Terms that govern the use of luxwebstudio.dev and web development services provided by LuxWeb Studio.",
  openGraph: {
    title: "Terms of Service - LuxWeb Studio",
    description: "Terms that govern the use of luxwebstudio.dev and web development services provided by LuxWeb Studio.",
    url: "/terms",
  },
}

const EFFECTIVE_DATE = "May 14, 2026"
const LAST_UPDATED = "May 14, 2026"

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <article className="container mx-auto max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Effective Date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last Updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
            <a
              href="https://luxwebstudio.dev"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              luxwebstudio.dev
            </a>{" "}
            (the &ldquo;Site&rdquo;) and any web development services provided by LuxWeb Studio
            (&ldquo;LuxWeb Studio,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;). By accessing the Site or engaging us for services, you agree to
            these Terms.
          </p>

          <Section heading="1. Services">
            <p>
              LuxWeb Studio is a web development studio that designs, builds, and maintains
              custom websites and web applications for businesses. The specific scope,
              deliverables, timeline, and fees for any project will be defined in a separate
              proposal, statement of work, or written agreement (&ldquo;Project Agreement&rdquo;)
              between LuxWeb Studio and the client.
            </p>
            <p>
              If there is a conflict between these Terms and a Project Agreement, the Project
              Agreement controls for that engagement.
            </p>
          </Section>

          <Section heading="2. Quotes and Pricing">
            <p>
              Quotes provided through the Site, by email, or in writing are estimates based on
              the information available at the time. Final pricing is set in the Project
              Agreement. Quotes are valid for 30 days unless otherwise stated.
            </p>
          </Section>

          <Section heading="3. Payment Terms">
            <p>Unless otherwise agreed in writing:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>A deposit is required before work begins (typically 50% of the total project fee)</li>
              <li>The remainder is due upon project completion and prior to final delivery or launch</li>
              <li>Ongoing services (e.g., retainers, hosting, maintenance) are billed monthly in advance</li>
              <li>Invoices are due within 14 days of issuance</li>
              <li>Late payments may accrue interest at 1.5% per month, or the maximum allowed by law</li>
            </ul>
            <p>
              All fees are in U.S. dollars and are non-refundable once work has commenced, except
              as expressly agreed in writing.
            </p>
          </Section>

          <Section heading="4. Client Responsibilities">
            <p>To deliver projects on time, we need your cooperation. You agree to:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>Provide all content, images, branding assets, and feedback in a reasonable and timely manner</li>
              <li>Designate a primary point of contact authorized to make decisions</li>
              <li>Review deliverables and provide written feedback within agreed timeframes</li>
              <li>Pay invoices on time</li>
            </ul>
            <p>
              Delays caused by missing content, delayed feedback, or non-payment may extend the
              project timeline and may incur additional fees.
            </p>
          </Section>

          <Section heading="5. Revisions and Scope">
            <p>
              The number of design and revision rounds is specified in the Project Agreement.
              Revisions outside the agreed scope, or significant changes to project requirements
              after work has begun, are considered scope changes and may require a written change
              order and additional fees.
            </p>
          </Section>

          <Section heading="6. Intellectual Property">
            <ul className="list-disc list-outside ml-6 space-y-3">
              <li>
                <strong className="font-semibold text-white">Final deliverables.</strong> Upon
                full payment, the client owns the final design and front-end code produced
                specifically for the project, excluding any third-party assets, libraries,
                frameworks, or pre-existing LuxWeb Studio components included in the project.
              </li>
              <li>
                <strong className="font-semibold text-white">Pre-existing materials.</strong>{" "}
                LuxWeb Studio retains ownership of any tools, code libraries, methodologies, and
                pre-existing materials used to deliver the project. The client receives a
                non-exclusive, perpetual license to use these materials as embedded in the
                project.
              </li>
              <li>
                <strong className="font-semibold text-white">Third-party components.</strong> The
                project may incorporate open-source software, frameworks, fonts, and other
                third-party components, each subject to its own license. The client agrees to
                comply with those licenses.
              </li>
              <li>
                <strong className="font-semibold text-white">Portfolio rights.</strong> LuxWeb
                Studio retains the right to display the project in our portfolio, case studies,
                and marketing materials, unless the client requests otherwise in writing.
              </li>
            </ul>
          </Section>

          <Section heading="7. Confidentiality">
            <p>
              Each party agrees to keep confidential any non-public information shared by the
              other party during the engagement and to use such information only to perform under
              the Project Agreement. This obligation does not apply to information that is
              publicly available, independently developed, or required to be disclosed by law.
            </p>
          </Section>

          <Section heading="8. Hosting, Domains, and Third-Party Services">
            <p>
              Unless otherwise agreed, the client is responsible for purchasing and maintaining
              their own domain name, hosting, and any third-party services (such as analytics,
              email providers, payment processors, or content management systems). Where LuxWeb
              Studio sets these up on the client&apos;s behalf, the client agrees to the terms of
              the underlying providers and remains responsible for ongoing fees.
            </p>
          </Section>

          <Section heading="9. AI-Powered Features">
            <p>
              The Site includes an AI chat assistant and AI-generated email replies powered by
              third-party providers. AI responses are generated automatically and may contain
              inaccuracies. AI features are provided for general information and lead intake only
              and are not a substitute for a formal proposal, contract, or professional advice.
            </p>
            <p>
              Conversations with our AI assistant may be stored and reviewed to improve our
              service. See our{" "}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                Privacy Policy
              </Link>{" "}
              for details on how this data is handled.
            </p>
          </Section>

          <Section heading="10. Warranties and Disclaimers">
            <p>
              LuxWeb Studio warrants that services will be performed in a professional and
              workmanlike manner. Except as expressly stated in these Terms or a Project
              Agreement, all services and deliverables are provided{" "}
              <strong className="font-semibold text-white">&ldquo;as is&rdquo;</strong> without
              warranty of any kind, express or implied, including warranties of merchantability,
              fitness for a particular purpose, non-infringement, or that the Site or
              deliverables will be uninterrupted or error-free.
            </p>
            <p>
              We do not guarantee specific business outcomes, search engine rankings, lead
              volumes, or revenue results.
            </p>
          </Section>

          <Section heading="11. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, LuxWeb Studio&apos;s total cumulative
              liability arising out of or related to these Terms or any Project Agreement will
              not exceed the total amount paid by the client to LuxWeb Studio for the specific
              project giving rise to the claim, in the 6 months preceding the claim.
            </p>
            <p>
              In no event will LuxWeb Studio be liable for any indirect, incidental, special,
              consequential, exemplary, or punitive damages, including lost profits, lost
              revenue, lost data, or business interruption, even if advised of the possibility of
              such damages.
            </p>
          </Section>

          <Section heading="12. Indemnification">
            <p>
              The client agrees to indemnify, defend, and hold harmless LuxWeb Studio and its
              agents from any third-party claims, damages, liabilities, and expenses (including
              reasonable attorneys&apos; fees) arising out of (a) content, assets, or
              instructions the client provided, (b) the client&apos;s use of the deliverables,
              or (c) the client&apos;s breach of these Terms.
            </p>
          </Section>

          <Section heading="13. Termination">
            <p>
              Either party may terminate a Project Agreement for material breach by the other
              party if the breach is not cured within 14 days of written notice. Upon termination:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>The client must pay for all work performed and expenses incurred up to the date of termination</li>
              <li>LuxWeb Studio will deliver any work-in-progress that has been paid for</li>
              <li>
                Sections concerning intellectual property, confidentiality, warranties,
                limitation of liability, and indemnification survive termination
              </li>
            </ul>
          </Section>

          <Section heading="14. Acceptable Use of the Site">
            <p>When using the Site, you agree not to:</p>
            <ul className="list-disc list-outside ml-6 space-y-1">
              <li>Use the Site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Site or our systems</li>
              <li>Interfere with or disrupt the Site or its servers</li>
              <li>Use automated systems (bots, scrapers, etc.) in a way that places unreasonable load on the Site</li>
              <li>Submit false, misleading, or harmful information through any form</li>
            </ul>
          </Section>

          <Section heading="15. Governing Law">
            <p>
              These Terms are governed by the laws of the State of Georgia, United States,
              without regard to its conflict of laws principles. Any dispute arising under these
              Terms will be resolved exclusively in the state or federal courts located in
              Georgia, and the parties consent to personal jurisdiction in those courts.
            </p>
          </Section>

          <Section heading="16. Changes to These Terms">
            <p>
              We may update these Terms from time to time. The &ldquo;Last Updated&rdquo; date
              reflects the most recent revision. Continued use of the Site after changes are
              posted constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <Section heading="17. Severability">
            <p>
              If any provision of these Terms is held to be unenforceable, the remaining
              provisions will continue in full force and effect, and the unenforceable provision
              will be modified to the minimum extent necessary to make it enforceable.
            </p>
          </Section>

          <Section heading="18. Contact">
            <p>For questions about these Terms, contact us at:</p>
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
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                Privacy Policy
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
