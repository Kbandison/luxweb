'use client'

import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Plus } from "lucide-react"
import { motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"
import { signatureSite, addOns } from "@/data/packages"

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 px-6">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              One Package. <span className="text-gradient-purple">Real Results.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              No confusing tiers or hidden fees. A complete, custom website designed to convert visitors into customers.
            </p>
          </div>
        </ScrollReveal>

        {/* Signature Site card */}
        <ScrollReveal delay={0.1}>
          <motion.div
            className="modern-card p-8 sm:p-10 border-2 border-purple-400/30 animate-subtle-glow mb-10"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{signatureSite.name}</h3>
              <p className="text-gray-400 mb-5 max-w-xl mx-auto">{signatureSite.description}</p>
              <div className="text-4xl sm:text-5xl font-bold text-white">{signatureSite.price}</div>
              <p className="text-sm text-gray-500 mt-2">Payment: 50% deposit to start, 50% on launch</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8 max-w-2xl mx-auto">
              {signatureSite.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-5 mb-6">
              <p className="text-xs text-gray-500 mb-1">Ideal for:</p>
              <p className="text-sm text-white">{signatureSite.idealFor}</p>
            </div>

            <div className="text-center">
              <a href="/contact">
                <Button className="modern-btn-primary text-white px-10 py-3.5 text-base font-semibold h-auto">
                  {signatureSite.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Add-ons */}
        <ScrollReveal delay={0.2}>
          <div className="modern-card p-8">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Add-Ons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {addOns.map((addon, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-sm font-medium text-white">{addon.name}</span>
                  </div>
                  <div className="text-lg font-bold text-purple-400 mb-1">{addon.price}</div>
                  {addon.description && (
                    <p className="text-xs text-gray-500">{addon.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
