'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <motion.div 
            className="glass-card p-8 md:p-12 rounded-2xl text-center"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                  Get Started?
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Let's discuss your project and create a website that grows your business
              </p>
              
              {/* Urgency Elements */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
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
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <a href="/contact">
                <Button className="modern-btn-primary text-white font-semibold py-6 px-12 text-xl hover:scale-105 transition-all duration-300 ease-out">
                  Start My Project
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </a>
            </motion.div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-gray-400 text-sm">
                Or email us directly at{' '}
                <a href="mailto:hello@luxwebstudio.com" className="text-green-400 hover:text-green-300 transition-colors duration-300 ease-out">
                  hello@luxwebstudio.com
                </a>
              </p>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}