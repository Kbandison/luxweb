'use client'

import { Check, ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"
import Link from "next/link"
import { signatureSite, addOns } from "@/data/packages"

export default function PricingCondensed() {
  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="container mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              One Package. <span className="text-gradient-purple">Real Results.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              No confusing tiers. Just a complete, professional website built to grow your business.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <motion.div
            className="modern-card p-8 sm:p-10 border-2 border-purple-400/30 animate-subtle-glow"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{signatureSite.name}</h3>
              <p className="text-gray-400 mb-5">{signatureSite.description}</p>
              <div className="text-4xl font-bold text-white">{signatureSite.price}</div>
              <p className="text-sm text-gray-500 mt-1">Payment: 50% deposit, 50% on launch</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
              {signatureSite.features.slice(0, 6).map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a href="/contact">
                <Button className="modern-btn-primary text-white px-8 py-3 text-base font-semibold h-auto">
                  {signatureSite.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors inline-flex items-center gap-1.5"
            >
              See full details & add-ons
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
