import Hero from "@/components/Hero"
import LogoBar from "@/components/LogoBar"
import ProblemSolution from "@/components/ProblemSolution"
import Portfolio from "@/components/Portfolio"
import SocialProofStrip from "@/components/SocialProofStrip"
import ProcessSection from "@/components/ProcessSection"
import PricingCondensed from "@/components/PricingCondensed"
import TestimonialCarousel from "@/components/TestimonialCarousel"
import FAQCondensed from "@/components/FAQCondensed"
import CTASection from "@/components/CTASection"
import FloatingCTA from "@/components/FloatingCTA"
import { getProjects } from "@/lib/projects"

export default async function Home() {
  const projects = await getProjects()

  return (
    <main className="min-h-screen relative">
      {/* Unified Background */}
      <div
        className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-[rgb(1,4,9)] via-[rgb(2,5,11)] to-[rgb(3,6,12)] -z-10"
        style={{
          backgroundAttachment: 'fixed',
          backgroundSize: '150% 150%',
          backgroundPosition: 'center center'
        }}
      />

      {/* Subtle ambient glow */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <Hero projects={projects} />
        <LogoBar projects={projects} />
        <ProblemSolution />
        <Portfolio projects={projects} />
        <SocialProofStrip />
        <ProcessSection />
        <PricingCondensed />
        <TestimonialCarousel />
        <FAQCondensed />
        <CTASection />
      </div>

      <FloatingCTA />
    </main>
  )
}
