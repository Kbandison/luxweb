'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Users, Clock, TrendingDown, Eye, Shield, Award, DollarSign, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  }

  const trustBadgeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      }
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 sm:py-32 relative overflow-hidden">
      {/* Grid pattern only behind title and trust badges */}
      <div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:64px_64px] opacity-25"></div>
      <div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-gradient-to-r from-[rgb(1,4,9)] via-transparent to-[rgb(1,4,9)] opacity-98"></div>
      <div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-gradient-to-b from-[rgb(1,4,9)] via-transparent to-[rgb(1,4,9)] opacity-50"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          className="text-center space-y-8 sm:space-y-10 py-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main Headline */}
          <motion.div className="space-y-4 sm:space-y-6" variants={itemVariants}>
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-r from-white via-white to-[rgb(98,67,255)] bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Get More Customers With A Website
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">That Actually Converts</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium"
              variants={itemVariants}
            >
              Stop losing potential customers to competitors with better websites. 
              <br className="hidden sm:block" />
              We build modern, professional sites that turn visitors into customers.
            </motion.p>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6 sm:pt-8"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <a href="/contact">
                <Button 
                  className="modern-btn-primary text-white px-12 py-5 text-xl font-semibold cursor-pointer"
                >
                  Let's Discuss My Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => scrollToSection('portfolio')}
                variant="outline"
                className="modern-btn-secondary text-white px-12 py-5 text-xl font-semibold cursor-pointer"
              >
                See Our Work
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 pt-6"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium text-sm">Free Consultation</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">24hr Response Time</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-xl border border-purple-500/20">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-medium text-sm">Limited Availability</span>
            </div>
          </motion.div>

          {/* Value Proposition Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 sm:pt-8"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-white/5 rounded-lg border border-white/10"
              variants={trustBadgeVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Zap className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-400 text-sm">Websites delivered in 1-2 weeks</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-white/5 rounded-lg border border-white/10"
              variants={trustBadgeVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Simple Process</h3>
              <p className="text-gray-400 text-sm">Straightforward, no-hassle workflow</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-white/5 rounded-lg border border-white/10"
              variants={trustBadgeVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Award className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Quality Focus</h3>
              <p className="text-gray-400 text-sm">Built to convert visitors into customers</p>
            </motion.div>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="text-center pt-8"
            variants={itemVariants}
          >
            <p className="text-gray-400 text-sm">Trusted by 50+ businesses to grow their online presence</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}