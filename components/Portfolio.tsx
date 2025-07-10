'use client'

import { ExternalLink, TrendingUp, Code, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"
import { projects, portfolioStats } from "@/data/projects"
import Link from "next/link"
import Image from "next/image"

export default function Portfolio() {
  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Icon mapping for stats
  const iconMap = {
    Code,
    Users,
    TrendingUp
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: "bg-green-400/20 text-green-400",
      blue: "bg-blue-400/20 text-blue-400", 
      amber: "bg-amber-400/20 text-amber-400"
    }
    return colorMap[color as keyof typeof colorMap] || "bg-gray-400/20 text-gray-400"
  }

  return (
    <section id="portfolio" className="py-20 px-4 relative">
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
          {projects.slice(0, 3).map((project, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="glass-card rounded-2xl overflow-hidden glass-hover group"
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
              {/* Project Image */}
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
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
                <div className="flex items-center gap-2 p-3 bg-green-400/10 rounded-lg border border-green-400/20 mb-4">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">{project.result}</span>
                </div>

                {/* Action Button */}
                {project.links?.live && (
                  <a 
                    href={project.links.live} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full modern-btn-primary text-white py-2 text-sm font-medium">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Site
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View More Projects Button - Only show if there are more than 3 projects */}
        {projects.length > 3 && (
          <ScrollReveal delay={0.3}>
            <div className="text-center mb-16">
              <Link href="/projects">
                <Button className="modern-btn-outline text-white px-8 py-4 text-lg font-semibold">
                  View More Projects
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        )}

        {/* Portfolio Stats */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" staggerChildren={0.2}>
          {portfolioStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
            const colorClasses = getColorClasses(stat.color)
            
            return (
              <StaggerItem key={index}>
                <motion.div 
                  className="glass-card p-8 rounded-2xl text-center"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colorClasses.split(' ')[0]}`}>
                    <IconComponent className={`w-8 h-8 ${colorClasses.split(' ')[1]}`} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

      </div>
    </section>
  )
}