import { Metadata } from "next"
import { ogImage } from "@/lib/og"
import ProjectsGrid from "@/components/ProjectsGrid"
import { getProjects } from "@/lib/projects"
import { getActivePromo, getCtaLabel } from "@/data/promo"

export const metadata: Metadata = {
  title: "Our Work",
  description: "Websites LuxWeb Studio has built for real businesses — from online ordering to lead-generation platforms.",
  openGraph: {
    title: "Our Work | LuxWeb Studio",
    description: "Websites LuxWeb Studio has built for real businesses — from online ordering to lead-generation platforms.",
    url: "/projects",
    images: [ogImage],
  },
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="min-h-screen pt-[calc(5rem+var(--promo-offset,0px))]">
      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Our <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Work</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real sites we&apos;ve built for real businesses.
          </p>
        </div>

        <ProjectsGrid projects={projects} ctaLabel={getCtaLabel(getActivePromo())} />
      </div>
    </main>
  )
}
