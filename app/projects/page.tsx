import { Metadata } from "next"
import { projects, portfolioStats } from "@/data/projects"
import ProjectsGrid from "@/components/ProjectsGrid"

export const metadata: Metadata = {
  title: "Projects - LuxWeb Studio | Our Portfolio & Case Studies",
  description: "Explore our portfolio of successful web development projects. See how we've helped businesses across various industries grow with professional, conversion-focused websites. Real results, real clients.",
  keywords: ["web development portfolio", "case studies", "website examples", "business websites", "conversion optimization results", "LuxWeb Studio projects"],
  openGraph: {
    title: "LuxWeb Studio Projects - Portfolio & Case Studies",
    description: "Explore our portfolio of successful web development projects. See how we've helped businesses grow with professional, conversion-focused websites.",
    url: "/projects",
  },
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Our <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Project Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover how we've transformed businesses across industries with custom web solutions that drive real results and growth.
          </p>
        </div>
        
        <ProjectsGrid />
      </div>
    </main>
  )
}