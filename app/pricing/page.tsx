import Services from "@/components/Services"
import FAQ from "@/components/FAQ"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - LuxWeb Studio | Professional Web Development Packages",
  description: "Choose the perfect web development package for your business. Transparent pricing starting at $1,497, no hidden fees, and packages designed to convert visitors into customers. Get your custom website in 1-2 weeks.",
  keywords: ["web development pricing", "website cost", "web design packages", "professional website pricing", "custom website development cost", "LuxWeb Studio pricing"],
  openGraph: {
    title: "LuxWeb Studio Pricing - Professional Web Development Packages",
    description: "Choose the perfect web development package for your business. Transparent pricing, no hidden fees, and packages designed to convert visitors into customers.",
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