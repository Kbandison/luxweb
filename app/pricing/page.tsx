import Services from "@/components/Services"
import FAQ from "@/components/FAQ"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - LuxWeb Studio | Professional Web Development Packages",
  description: "Choose the perfect web development package for your business. Transparent pricing, no hidden fees, and packages designed to convert visitors into customers.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-20">
      <Services />
      <FAQ />
    </main>
  )
}