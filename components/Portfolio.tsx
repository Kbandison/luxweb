'use client'

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"
import { projects } from "@/data/projects"
import Link from "next/link"
import Image from "next/image"
import ImageLightbox from "./ImageLightbox"
import { useState } from "react"

export default function Portfolio() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxTitle, setLightboxTitle] = useState('')

  const openLightbox = (images: string[], index: number, title: string) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxTitle(title)
    setLightboxOpen(true)
  }

  // First 4 projects for bento grid, plus a CTA card
  const featured = projects[0]
  const gridProjects = projects.slice(1, 4)

  return (
    <section id="portfolio" className="py-20 lg:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Real Results for{' '}
              <span className="text-gradient-purple">Real Businesses</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See how we&apos;ve helped businesses grow with professional, conversion-focused websites.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Featured: large card - 2x2 */}
          <ScrollReveal className="lg:col-span-2 lg:row-span-2">
            <PortfolioCard
              project={featured}
              onOpenLightbox={openLightbox}
              className="h-full min-h-[300px] lg:min-h-full"
            />
          </ScrollReveal>

          {/* Project 2 */}
          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <PortfolioCard
              project={gridProjects[0]}
              onOpenLightbox={openLightbox}
              className="h-full min-h-[220px]"
            />
          </ScrollReveal>

          {/* Project 3 */}
          <ScrollReveal delay={0.15} className="lg:col-span-2">
            <PortfolioCard
              project={gridProjects[1]}
              onOpenLightbox={openLightbox}
              className="h-full min-h-[220px]"
            />
          </ScrollReveal>

          {/* Project 4 */}
          <ScrollReveal delay={0.2} className="lg:col-span-2">
            <PortfolioCard
              project={gridProjects[2]}
              onOpenLightbox={openLightbox}
              className="h-full min-h-[220px]"
            />
          </ScrollReveal>

          {/* CTA Card */}
          <ScrollReveal delay={0.25} className="lg:col-span-2">
            <Link href="/projects" className="block h-full">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-violet-500/5 h-full min-h-[220px] flex flex-col items-center justify-center p-8 group hover:border-purple-500/30 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">{projects.length}+</div>
                <div className="text-gray-400 mb-4">Projects Delivered</div>
                <div className="text-purple-400 font-medium text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>

      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        projectTitle={lightboxTitle}
      />
    </section>
  )
}

function PortfolioCard({
  project,
  onOpenLightbox,
  className = '',
}: {
  project: typeof projects[0]
  onOpenLightbox: (images: string[], index: number, title: string) => void
  className?: string
}) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden group cursor-pointer ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      onClick={() => onOpenLightbox(project.images, 0, project.title)}
    >
      {/* Background Image */}
      <Image
        src={project.images[0]}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-300" />

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.tech.slice(0, 2).map((tech) => (
            <span key={tech} className="text-[10px] uppercase tracking-wider text-gray-400 bg-white/10 px-2 py-0.5 rounded">
              {tech}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
        <p className="text-sm text-gray-400">{project.result}</p>

        {/* View Project link on hover */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.links?.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-purple-400 text-sm font-medium inline-flex items-center gap-1"
            >
              View Project <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-purple-400 text-sm font-medium inline-flex items-center gap-1">
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
