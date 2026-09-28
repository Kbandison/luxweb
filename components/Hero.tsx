'use client'

import { Button } from "@/components/ui/button"
import { Zap, Clock, MessageCircle } from "lucide-react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import Image from "next/image"
import type { Project } from "@/data/projects"
import { useEffect, useState } from "react"
import CtaButton from "./CtaButton"

// Resting position of each browser mockup. Done in CSS rather than JS so the
// server render already matches the viewport — no layout shift on hydration.
// The third card only shows on desktop.
const MOCKUP_POSITIONS = [
  'z-0 rotate-[-4deg] -translate-x-[5%] translate-y-[3%] lg:rotate-[-6deg] lg:-translate-x-[10%] lg:translate-y-[5%]',
  'z-[11] rotate-[3deg] translate-x-[5%] lg:rotate-0 lg:translate-x-0',
  'hidden lg:block z-[2] rotate-[6deg] translate-x-[10%] translate-y-[5%]',
]

/** Real hostname for the mockup address bar; nothing for link shorteners. */
function displayDomain(url?: string): string | null {
  if (!url) return null
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'bit.ly' ? null : host
  } catch {
    return null
  }
}

export default function Hero({ projects, ctaLabel }: { projects: Project[]; ctaLabel: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(query.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / 30)
    mouseY.set((e.clientY - centerY) / 30)
  }

  // Parallax tilt transforms for browser mockups
  const rotateX = useTransform(mouseY, [-20, 20], [3, -3])
  const rotateY = useTransform(mouseX, [-20, 20], [-3, 3])

  const mockupProjects = projects.slice(0, 3)

  return (
    <section
      className="min-h-[90vh] lg:min-h-screen flex items-center justify-center px-6 pt-[calc(6rem+var(--promo-offset,0px))] pb-12 lg:pt-[calc(8rem+var(--promo-offset,0px))] lg:pb-20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Text renders visible from the first paint — hiding it behind an
            entrance animation delayed Largest Contentful Paint until JS loaded. */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            Work directly with your developer
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-white">Get More Customers</span>
            <br />
            <span className="text-gradient-purple">With a Better Website.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            Custom websites for local service businesses, built to turn visitors into leads.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <CtaButton label={ctaLabel} location="hero" className="px-8 py-4 text-base font-semibold" />
            <Button
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="modern-btn-secondary text-white px-8 py-4 text-base font-semibold h-auto"
            >
              See Our Work
            </Button>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 lg:mb-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Free 30-Min Consultation</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Live in 2–3 Weeks</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span>Reply Within 24 Hours</span>
            </div>
          </div>

          {/* Browser Mockup Cards */}
          <motion.div
            className="relative w-full max-w-3xl mx-auto"
            style={isDesktop ? { rotateX, rotateY, perspective: 1000 } : undefined}
          >
            <div className="relative h-[280px] sm:h-[350px] lg:h-[400px]">
              {mockupProjects.map((project, index) => {
                const domain = displayDomain(project.links?.live)
                return (
                  <div
                    key={project.title}
                    className={`absolute inset-0 mx-auto w-[85%] sm:w-[75%] lg:w-[65%] ${MOCKUP_POSITIONS[index]}`}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 4 + index * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.3,
                      }}
                    >
                      {/* Browser Chrome */}
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-[rgb(1,4,9)] shadow-2xl shadow-purple-500/5">
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] border-b border-white/5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                          <div className="flex-1 mx-3 h-5 rounded bg-white/5 flex items-center px-2">
                            {domain && <span className="text-[10px] text-gray-400 truncate">{domain}</span>}
                          </div>
                        </div>
                        <div className="aspect-[16/10] relative">
                          <Image
                            src={project.images[0]}
                            alt={`${project.title} website`}
                            fill
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 75vw, 500px"
                            className="object-cover"
                            priority={index === 1}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
