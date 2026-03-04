'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Clock, MessageCircle } from "lucide-react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { projects } from "@/data/projects"
import { useEffect, useState } from "react"

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024)
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / 30)
    mouseY.set((e.clientY - centerY) / 30)
  }

  // Parallax tilt transforms for browser mockups
  const rotateX = useTransform(mouseY, [-20, 20], [3, -3])
  const rotateY = useTransform(mouseX, [-20, 20], [-3, 3])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Use first 3 project screenshots for mockups
  const mockupProjects = projects.slice(0, 3)

  return (
    <section
      className="min-h-[90vh] lg:min-h-screen flex items-center justify-center px-6 pt-24 pb-12 lg:pt-32 lg:pb-20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              Websites that convert. On time. Every time.
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-white">Get More Customers</span>
            <br />
            <span className="text-gradient-purple">With a Better Website.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We build conversion-focused websites for businesses ready to grow.
            In 1–2 weeks, not months.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/contact">
              <Button className="modern-btn-primary text-white px-8 py-4 text-base font-semibold h-auto">
                Get a Free Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button
              onClick={() => scrollToSection('portfolio')}
              variant="outline"
              className="modern-btn-secondary text-white px-8 py-4 text-base font-semibold h-auto"
            >
              See Our Work
            </Button>
          </motion.div>

          {/* Trust Strip */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-16 lg:mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Free Consultation</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>1–2 Week Delivery</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span>24hr Response</span>
            </div>
          </motion.div>

          {/* Browser Mockup Cards */}
          <motion.div
            className="relative w-full max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={!isMobile ? { rotateX, rotateY, perspective: 1000 } : undefined}
          >
            <div className="relative h-[280px] sm:h-[350px] lg:h-[400px]">
              {mockupProjects.slice(0, isMobile ? 2 : 3).map((project, index) => {
                const offsets = [
                  { rotate: -6, x: '-10%', y: '5%', z: 0 },
                  { rotate: 0, x: '0%', y: '0%', z: 10 },
                  { rotate: 6, x: '10%', y: '5%', z: 0 },
                ]
                const mobileOffsets = [
                  { rotate: -4, x: '-5%', y: '3%', z: 0 },
                  { rotate: 3, x: '5%', y: '0%', z: 10 },
                ]
                const offset = isMobile ? mobileOffsets[index] : offsets[index]
                if (!offset) return null

                return (
                  <motion.div
                    key={project.title}
                    className="absolute inset-0 mx-auto w-[85%] sm:w-[75%] lg:w-[65%]"
                    style={{
                      zIndex: offset.z + index,
                      transform: `translateX(${offset.x}) translateY(${offset.y}) rotate(${offset.rotate}deg)`,
                    }}
                    animate={{
                      y: [0, -8, 0],
                    }}
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
                          <span className="text-[10px] text-gray-600 truncate">{project.title.toLowerCase().replace(/\s/g, '')}.com</span>
                        </div>
                      </div>
                      <div className="aspect-[16/10] relative">
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          className="object-cover"
                          priority={index === 1}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
