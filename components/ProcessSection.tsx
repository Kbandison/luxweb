'use client'

import { motion } from "framer-motion"
import { MessageCircle, Palette, Code, Rocket, ArrowRight } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import Link from "next/link"

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We learn about your business, goals, and audience in a free 30-minute call.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Design",
    description: "Custom mockups tailored to your brand. You approve before we build.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Build",
    description: "Modern, clean code with regular progress updates and your feedback.",
    icon: Code,
  },
  {
    number: "04",
    title: "Launch",
    description: "Your site goes live. Training, support, and optimization included.",
    icon: Rocket,
  },
]

export default function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A simple, proven process from first call to launch day.
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: Horizontal Timeline */}
        <ScrollReveal>
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-8 relative">
              {/* Connecting Line */}
              <div className="absolute top-[52px] left-[12.5%] right-[12.5%] h-px">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500/50 via-violet-500/50 to-purple-500/50 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </div>

              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.number}
                    className="text-center relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
                  >
                    {/* Icon Circle */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      {/* Dot on timeline */}
                      <motion.div
                        className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-[rgb(1,4,9)]"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.15, duration: 0.3 }}
                      />
                    </div>

                    <div className="text-xs text-purple-400 font-mono mb-2">{step.number}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden">
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />

            <div className="space-y-10">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <ScrollReveal key={step.number} delay={index * 0.1}>
                    <div className="relative">
                      {/* Dot */}
                      <div className="absolute -left-8 top-1 w-[23px] h-[23px] rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      </div>

                      <div className="text-xs text-purple-400 font-mono mb-1">{step.number}</div>
                      <h3 className="text-lg font-semibold text-white mb-1.5 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-purple-400" />
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-16">
            <Link
              href="/contact"
              className="text-purple-400 hover:text-purple-300 font-medium text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
