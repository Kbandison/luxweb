import Hero from "@/components/Hero"
import PainPoints from "@/components/PainPoints"
import Solutions from "@/components/Solutions"
import AboutUs from "@/components/AboutUs"
import ProcessSection from "@/components/ProcessSection"
import Portfolio from "@/components/Portfolio"
import TestimonialCarousel from "@/components/TestimonialCarousel"
import PricingCondensed from "@/components/PricingCondensed"
import FAQCondensed from "@/components/FAQCondensed"
import CTASection from "@/components/CTASection"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Unified Parallax Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-[rgb(1,4,9)] via-[rgb(2,5,11)] to-[rgb(3,6,12)] -z-10"
        style={{ 
          backgroundAttachment: 'fixed',
          backgroundSize: '150% 150%',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Mobile fallback background (for devices that don't support background-attachment: fixed) */}
      <div 
        className="md:hidden fixed inset-0 w-full h-full bg-gradient-to-br from-black via-[rgb(1,4,9)] via-[rgb(2,5,11)] to-[rgb(3,6,12)] -z-10"
        style={{ 
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Parallax Depth Elements */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Content Sections */}
      <div className="relative z-10">
        <Hero />
        <PainPoints />
        <Solutions />
        <AboutUs />
        <ProcessSection />
        <Portfolio />
        <TestimonialCarousel />
        <PricingCondensed />
        <FAQCondensed />
        <CTASection />
      </div>
    </main>
  )
}
