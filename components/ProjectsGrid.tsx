'use client'

import { ExternalLink, TrendingUp, Code, Users, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"
import { projects, portfolioStats } from "@/data/projects"

export default function ProjectsGrid() {
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({})

  const nextImage = (projectIndex: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectIndex]: ((prev[projectIndex] || 0) + 1) % totalImages
    }))
  }

  const prevImage = (projectIndex: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectIndex]: ((prev[projectIndex] || 0) - 1 + totalImages) % totalImages
    }))
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
    <div>
      {/* Portfolio Stats */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {portfolioStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
            const colorClasses = getColorClasses(stat.color)
            
            return (
              <motion.div 
                key={index}
                className="glass-card p-8 rounded-2xl text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${colorClasses.split(' ')[0]}`}>
                  <IconComponent className={`w-10 h-10 ${colorClasses.split(' ')[1]}`} />
                </div>
                <div className="text-4xl font-bold text-white mb-3">{stat.value}</div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </ScrollReveal>

      {/* Projects Grid */}
      <ScrollReveal delay={0.2}>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Featured <span className="text-purple-400">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Each project represents a unique solution tailored to our client's specific needs and goals.
          </p>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20" staggerChildren={0.15}>
        {projects.map((project, index) => (
          <StaggerItem key={index}>
            <motion.div 
              className="glass-card rounded-2xl overflow-hidden glass-hover group h-full"
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              {/* Project Image Carousel */}
              <div className="relative h-64 overflow-hidden">
                {/* Current Image */}
                <div className={`h-full bg-gradient-to-br ${project.color} relative transition-all duration-500`}>
                  {project.images.length > 0 && (
                    <img 
                      src={project.images[currentImageIndex[index] || 0]} 
                      alt={`${project.title} - Image ${(currentImageIndex[index] || 0) + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-white/90 text-lg font-semibold px-4 py-2 bg-black/40 rounded-full">
                      {project.category}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows - Only show if multiple images */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(index, project.images.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => nextImage(index, project.images.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}

                {/* Image Indicators - Only show if multiple images */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.images.map((_, imageIndex) => (
                      <button
                        key={imageIndex}
                        onClick={() => setCurrentImageIndex(prev => ({ ...prev, [index]: imageIndex }))}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          (currentImageIndex[index] || 0) === imageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* External Link Icon */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">{project.description}</p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300 border border-white/20 hover:bg-white/20 transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Result */}
                <div className="flex items-center gap-3 p-4 bg-green-400/10 rounded-xl border border-green-400/20 mb-6">
                  <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-green-400 font-semibold">{project.result}</span>
                </div>

                {/* Action Button */}
                {project.links?.live ? (
                  <a 
                    href={project.links.live} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full modern-btn-primary text-white py-3 text-base font-medium">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View Site
                    </Button>
                  </a>
                ) : (
                  <Button className="w-full modern-btn-secondary text-white py-3 text-base font-medium">
                    View Project Details
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Call to Action */}
      <ScrollReveal delay={0.4}>
        <div className="text-center">
          <div className="glass-card p-12 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-purple-400">Next Project?</span>
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can create a custom solution that drives real results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact">
                <Button className="modern-btn-primary text-white px-8 py-4 text-lg font-semibold">
                  Start My Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <a href="/pricing">
                <Button className="modern-btn-outline text-white px-8 py-4 text-lg">
                  View Pricing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}