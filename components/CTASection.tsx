'use client'

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function CTASection() {
  return (
    <section id="cta-section" className="py-24 lg:py-32 px-6 relative overflow-hidden">
      {/* Subtle purple gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent" />

      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Your competitors are already online.
            <br />
            <span className="text-gray-500">Let&apos;s make sure you stand out.</span>
          </h2>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/contact">
              <Button className="modern-btn-primary text-white font-semibold py-5 px-10 text-lg h-auto">
                Get a Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.p
            className="text-gray-500 text-sm max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            No commitment. Just a conversation about what your business needs.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
