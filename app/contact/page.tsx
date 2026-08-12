import Contact from "@/components/Contact"
import { Metadata } from "next"
import { Suspense } from "react"
import { businessPhone, businessEmail } from "@/data/contact"

export const metadata: Metadata = {
  title: "Contact - LuxWeb Studio | Get Your Free Quote",
  description: `Ready to transform your business with a professional website? Contact LuxWeb Studio for a free consultation and personalized quote. Call ${businessPhone.display} or email ${businessEmail}`,
  openGraph: {
    title: "Contact LuxWeb Studio - Get Your Free Quote",
    description: "Ready to transform your business with a professional website? Contact LuxWeb Studio for a free consultation and personalized quote.",
    url: "/contact",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-[calc(5rem+var(--promo-offset,0px))]">
      <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
        <Contact />
      </Suspense>
    </main>
  )
}