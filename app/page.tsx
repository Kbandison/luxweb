import Hero from "@/components/Hero"
import PainPoints from "@/components/PainPoints"
import Solutions from "@/components/Solutions"
import AboutUs from "@/components/AboutUs"
import Portfolio from "@/components/Portfolio"
import TestimonialCarousel from "@/components/TestimonialCarousel"
import PricingCondensed from "@/components/PricingCondensed"
import FAQCondensed from "@/components/FAQCondensed"
import CTASection from "@/components/CTASection"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PainPoints />
      <Solutions />
      <AboutUs />
      <Portfolio />
      <TestimonialCarousel />
      <PricingCondensed />
      <FAQCondensed />
      <CTASection />
    </main>
  )
}
