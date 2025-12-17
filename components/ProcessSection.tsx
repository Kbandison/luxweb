'use client'

import { motion } from "framer-motion"
import { MessageCircle, Palette, Code, Rocket, CheckCircle, Timer, Users, Zap } from "lucide-react"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"

export default function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Discovery Call",
      subtitle: "Understanding Your Vision",
      description: "We start with a free 30-minute consultation to understand your business goals, target audience, and specific requirements. No sales pressure - just genuine conversation about your vision.",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
      features: ["Free consultation", "Goal assessment", "Requirements gathering", "Timeline discussion"]
    },
    {
      number: "02", 
      title: "Strategy & Design",
      subtitle: "Crafting Your Digital Identity",
      description: "Our team creates a custom strategy and stunning design mockups tailored to your brand. You'll see exactly how your website will look before we write a single line of code.",
      icon: Palette,
      color: "from-purple-500 to-violet-500",
      features: ["Custom design mockups", "Brand integration", "User experience planning", "Mobile-first approach"]
    },
    {
      number: "03",
      title: "Development & Testing",
      subtitle: "Building Your Digital Masterpiece", 
      description: "We bring your design to life with clean, modern code. Throughout development, we keep you updated with progress and gather your feedback to ensure everything exceeds expectations.",
      icon: Code,
      color: "from-green-500 to-emerald-500",
      features: ["Modern development", "Regular updates", "Quality testing", "Performance optimization"]
    },
    {
      number: "04",
      title: "Launch & Growth",
      subtitle: "Watch Your Business Soar",
      description: "Your website goes live and starts attracting customers immediately! We provide training, ongoing support, and optimization recommendations to help you maximize your ROI and dominate your market.",
      icon: Rocket,
      color: "from-orange-500 to-red-500",
      features: ["Smooth launch", "Training included", "Ongoing support", "Growth optimization"],
      isExciting: true
    }
  ]

  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Our Proven <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">4-Step Process</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From initial consultation to launch and beyond, we guide you through every step to ensure your website not only looks amazing but drives real business results.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="space-y-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            const isEven = index % 2 === 0
            
            return (
              <StaggerItem key={index}>
                <motion.div
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
                  whileInView={{
                    opacity: 1,
                    y: 0
                  }}
                  initial={{
                    opacity: 0,
                    y: 50
                  }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{ opacity: 1 }} // CSS fallback for visibility
                >
                  {/* Content Side */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className="text-6xl font-black bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-lg text-purple-400 font-medium mb-4">
                      {step.subtitle}
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className={`w-5 h-5 ${step.isExciting ? 'text-orange-400' : 'text-green-400'}`} />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {step.isExciting && (
                      <motion.div 
                        className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg"
                        animate={{ 
                          boxShadow: [
                            '0 0 20px rgba(251, 146, 60, 0.3)',
                            '0 0 30px rgba(251, 146, 60, 0.5)', 
                            '0 0 20px rgba(251, 146, 60, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="flex items-center gap-2 text-orange-400 font-semibold">
                          <Zap className="w-5 h-5" />
                          Ready to dominate your competition?
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Visual Side */}
                  <div className="flex-1 flex justify-center">
                    <motion.div 
                      className={`relative w-80 h-80 rounded-2xl bg-gradient-to-br ${step.color} p-1`}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: isEven ? 2 : -2
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-full h-full bg-[rgb(1,4,9)] rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className={`border border-gradient-to-r ${step.color}`}
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity, 
                                  delay: i * 0.05 
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Main Icon */}
                        <motion.div 
                          className={`w-24 h-24 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 relative z-10`}
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          <IconComponent className="w-12 h-12 text-white" />
                        </motion.div>

                        {/* Step Number */}
                        <div className="text-6xl font-black text-white/20 absolute bottom-4 right-4">
                          {step.number}
                        </div>

                        {/* Floating Elements */}
                        {step.isExciting && (
                          <>
                            <motion.div
                              className="absolute top-6 left-6 w-3 h-3 bg-orange-400 rounded-full"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <motion.div
                              className="absolute top-12 right-8 w-2 h-2 bg-red-400 rounded-full"
                              animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                            />
                            <motion.div
                              className="absolute bottom-12 left-8 w-4 h-4 bg-yellow-400 rounded-full"
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                            />
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.6}>
          <div className="text-center mt-16">
            <motion.div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-6"
              animate={{ 
                borderColor: [
                  'rgba(139, 92, 246, 0.2)',
                  'rgba(139, 92, 246, 0.4)',
                  'rgba(139, 92, 246, 0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Timer className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">Most projects completed in 1-3 weeks</span>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}