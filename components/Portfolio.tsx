'use client'

import { ExternalLink, TrendingUp, Code, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"

export default function Portfolio() {
  const projects = [
    {
      title: "Local Bakery Online Ordering System",
      description: "Helped local bakery increase online orders with easy-to-use ordering system",
      tech: ["Next.js", "Responsive Design", "Contact Forms"],
      result: "Increased online orders by 40%",
      category: "E-commerce",
      image: "/api/placeholder/400/300",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Healthcare Provider Professional Site",
      description: "Professional credibility site that converts prospects into patients",
      tech: ["Professional Design", "Mobile-First", "SEO Optimized"],
      result: "Enhanced professional credibility",
      category: "Healthcare",
      image: "/api/placeholder/400/300",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Community Resource Platform",
      description: "Modern, accessible design serving the community",
      tech: ["Modern UI/UX", "Accessibility Features", "Content Management"],
      result: "Improved community engagement",
      category: "Community",
      image: "/api/placeholder/400/300",
      color: "from-purple-500 to-pink-500"
    }
  ]

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Real <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                Results
              </span> for Real Businesses
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how we've helped businesses just like yours grow with professional, conversion-focused websites.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="glass-card rounded-2xl overflow-hidden glass-hover group"
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
              {/* Project Image Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-white/80 text-sm font-medium px-3 py-1 bg-black/30 rounded-full">
                    {project.category}
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Result */}
                <div className="flex items-center gap-2 p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">{project.result}</span>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Portfolio Stats */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" staggerChildren={0.2}>
          <StaggerItem>
            <motion.div 
              className="glass-card p-8 rounded-2xl text-center"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-400/20 mb-4">
                <Code className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300">Websites Delivered</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div 
              className="glass-card p-8 rounded-2xl text-center"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-400/20 mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div 
              className="glass-card p-8 rounded-2xl text-center"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400/20 mb-4">
                <TrendingUp className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">3x</div>
              <div className="text-gray-300">Average ROI Increase</div>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

      </div>
    </section>
  )
}