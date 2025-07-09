import Navigation from "@/components/Navigation"
import Services from "@/components/Services"
import TestimonialCarousel from "@/components/TestimonialCarousel"
import Contact from "@/components/Contact"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - LuxWeb Studio | Professional Web Development Packages",
  description: "Choose the perfect web development package for your business. Transparent pricing, no hidden fees, and packages designed to convert visitors into customers.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-20">
      <div className="container mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Choose Your <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Perfect Package</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transparent pricing with no surprises. Each package is designed to maximize your ROI and grow your business. 
            Choose the option that fits your needs and budget.
          </p>
        </div>
        
        <div className="mb-20">
          <Services />
        </div>
        
        <div className="mb-20">
          <TestimonialCarousel />
        </div>
        
        <Contact />
      </div>
    </main>
  )
}