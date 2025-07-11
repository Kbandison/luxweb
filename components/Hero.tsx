'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Users, Clock, TrendingDown, Eye, Shield, Award, DollarSign, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

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
    <section className="min-h-[80vh] sm:min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center px-6 pt-24 pb-2 sm:pt-28 sm:pb-4 lg:pt-32 lg:pb-16 relative overflow-hidden">
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Main Content */}
          <motion.div 
            className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 lg:col-span-1 max-w-4xl mx-auto lg:mx-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
          {/* Main Headline */}
          <motion.div className="space-y-4 sm:space-y-6" variants={itemVariants}>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-r from-white via-white to-[rgb(98,67,255)] bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Get More Customers With A Professional Website
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">That Actually Converts</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-lg sm:text-xl md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
              variants={itemVariants}
            >
              Stop losing potential customers to competitors with better websites. 
              We build modern, professional, mobile-responsive websites that turn visitors into customers with fast loading speeds, SEO optimization, and conversion-focused design.
            </motion.p>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center pt-6 sm:pt-8"
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
            className="flex flex-wrap justify-center lg:justify-start gap-4 pt-6"
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

          {/* Social Proof */}
          <motion.div 
            className="text-center pt-6"
            variants={itemVariants}
          >
            <p className="text-gray-400 text-sm text-center">Trusted by 50+ businesses to grow their online presence</p>
          </motion.div>
        </motion.div>

        {/* Right Image Section - Desktop Only */}
        <motion.div 
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative">
            {/* Main Hero Image */}
            <motion.div 
              className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="/Screenshot 2025-06-19 133941.png"
                  alt="Professional website design example showing modern business website with clean layout, responsive design, and conversion-focused elements created by LuxWeb Studio"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
              </div>
            </motion.div>

            {/* Floating Cards - Responsive positioning */}
            {/* Mobile: Show only 2 cards, positioned more conservatively */}
            <motion.div 
              className="absolute -top-4 -left-4 md:-top-6 md:-left-6 bg-green-500/95 text-white p-3 md:p-4 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 z-30"
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 md:w-5 md:h-5 rotate-180" />
                <div>
                  <p className="text-xs font-medium opacity-90">Conversion Rate</p>
                  <p className="text-base md:text-lg font-bold">+127%</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-blue-500/95 text-white p-3 md:p-4 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 z-30"
              animate={{ 
                y: [0, 8, 0],
                rotate: [0, -1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 md:w-5 md:h-5" />
                <div>
                  <p className="text-xs font-medium opacity-90">New Customers</p>
                  <p className="text-base md:text-lg font-bold">+89%</p>
                </div>
              </div>
            </motion.div>

            {/* Desktop only: Third card */}
            <motion.div 
              className="absolute top-1/3 -right-6 lg:-right-8 bg-purple-500/95 text-white p-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 z-30 hidden md:block"
              animate={{ 
                x: [0, 4, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <div>
                  <p className="text-xs font-medium opacity-90">Load Time</p>
                  <p className="text-sm font-bold">0.8s</p>
                </div>
              </div>
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl -z-10"></div>
            <div className="absolute -inset-8 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl -z-20"></div>
          </div>

          {/* Value Proposition Cards - Mobile */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 lg:hidden"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-white/10"
              variants={trustBadgeVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Zap className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">Fast Delivery</h3>
              <p className="text-gray-400 text-xs">1-2 weeks</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-white/10"
              variants={trustBadgeVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <CheckCircle className="w-6 h-6 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">Simple Process</h3>
              <p className="text-gray-400 text-xs">No-hassle workflow</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-white/10"
              variants={trustBadgeVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Award className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">Quality Focus</h3>
              <p className="text-gray-400 text-xs">Conversion-focused</p>
            </motion.div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}