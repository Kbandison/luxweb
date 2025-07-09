'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Lightbulb, Target } from 'lucide-react'
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal'

export default function AboutUs() {
  const values = [
    {
      icon: Heart,
      title: "We Care About Your Success",
      description: "Your business growth is our priority. We're not just building a website - we're building your digital future."
    },
    {
      icon: Users,
      title: "Personal Attention",
      description: "Work directly with us throughout the entire process. No account managers, no middlemen - just genuine partnership."
    },
    {
      icon: Lightbulb,
      title: "Modern Solutions",
      description: "We use the latest technologies and best practices to ensure your website is fast, secure, and effective."
    },
    {
      icon: Target,
      title: "Results-Focused",
      description: "Every design decision is made with one goal: helping your business attract and convert more customers."
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Why Choose <span className="text-purple-400">LuxWeb Studio</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                We're a dedicated team focused on helping small and medium businesses succeed online. 
                With fresh perspectives and modern techniques, we build websites that actually work for your business.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Founded on the belief that every business deserves a professional online presence, 
                we combine technical expertise with genuine care for your success.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="modern-card p-8 h-full"
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.2}>
          <div className="text-center">
            <div className="modern-card p-8 max-w-4xl mx-auto bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Our Commitment to You</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                  <div className="text-white font-medium mb-1">Transparent Process</div>
                  <div className="text-gray-400 text-sm">No surprises, clear communication</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">Direct</div>
                  <div className="text-white font-medium mb-1">Communication</div>
                  <div className="text-gray-400 text-sm">Work with us, not account managers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">Modern</div>
                  <div className="text-white font-medium mb-1">Technology</div>
                  <div className="text-gray-400 text-sm">Latest tools and best practices</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}