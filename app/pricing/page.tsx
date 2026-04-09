import Services from "@/components/Services"
import FAQ from "@/components/FAQ"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - LuxWeb Studio | The Signature Site Starting at $4,500",
  description: "Professional custom websites starting at $4,500. Mobile-first design, lead capture, local SEO, delivered in 2-3 weeks. No hidden fees, no confusing tiers.",
  keywords: ["web development pricing", "website cost", "custom website pricing", "professional website development", "local business website cost", "LuxWeb Studio pricing"],
  openGraph: {
    title: "LuxWeb Studio Pricing - The Signature Site",
    description: "Professional custom websites starting at $4,500. Mobile-first design, lead capture, local SEO, delivered in 2-3 weeks.",
    url: "/pricing",
  },
}

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-20">
      <Services />
      <FAQ />
    </main>
  )
}