import { Metadata } from "next"
import PricingPageContent from "@/components/PricingPageContent"

export const metadata: Metadata = {
  title: "Pricing - LuxWeb Studio | The Signature Site at $4,500",
  description: "A website that actually brings you customers. Custom-designed, mobile-first websites for local service businesses. The Signature Site — $4,500, delivered in 2-3 weeks.",
  openGraph: {
    title: "LuxWeb Studio Pricing - The Signature Site",
    description: "A website that actually brings you customers. Custom-designed, mobile-first websites built to turn visitors into leads.",
    url: "/pricing",
  },
}

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-20">
      <PricingPageContent />
    </main>
  )
}
