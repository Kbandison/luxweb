import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, Phone } from "lucide-react"
import { businessPhone } from "@/data/contact"
import PhoneLink from "@/components/PhoneLink"

// Post-submit confirmation. Kept out of search results — it only makes sense
// right after sending the form. Its URL doubles as a conversion goal for ads.
export const metadata: Metadata = {
  title: "Message Received",
  robots: { index: false, follow: false },
}

export default function ContactThanksPage() {
  return (
    <main className="min-h-screen pt-[calc(5rem+var(--promo-offset,0px))] px-4">
      <section className="container mx-auto max-w-2xl py-20 text-center">
        <CheckCircle className="mx-auto mb-6 h-14 w-14 text-green-400" />
        <h1 className="mb-4 text-4xl md:text-5xl font-bold text-white leading-tight">
          Got it. Thanks for reaching out.
        </h1>
        <p className="mb-10 text-xl text-gray-300 leading-relaxed">
          We&apos;ll reply within 24 hours to set up your free 30-minute call.
        </p>

        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-10">
          <p className="mb-3 text-sm text-gray-400">Need to talk sooner?</p>
          <PhoneLink
            location="thanks"
            className="inline-flex min-h-11 items-center gap-2 text-lg font-semibold text-green-400 hover:text-green-300 transition-colors"
          >
            <Phone className="h-5 w-5" />
            {businessPhone.display}
          </PhoneLink>
        </div>

        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          Browse our work while you wait
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
