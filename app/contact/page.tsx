import Contact from "@/components/Contact"
import { Metadata } from "next"
import { ogImage } from "@/lib/og"
import { businessPhone, businessEmail } from "@/data/contact"
import { getActivePromo } from "@/data/promo"

export const metadata: Metadata = {
  title: "Contact — Free 30-Minute Consultation",
  description: `Tell us about your project and get a free 30-minute consultation. We reply within 24 hours. Call ${businessPhone.display} or email ${businessEmail}.`,
  openGraph: {
    title: "Contact LuxWeb Studio — Free 30-Minute Consultation",
    description: "Tell us about your project and get a free 30-minute consultation. We reply within 24 hours.",
    url: "/contact",
    images: [ogImage],
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-[calc(5rem+var(--promo-offset,0px))]">
      <Contact promo={getActivePromo()} />
    </main>
  )
}
