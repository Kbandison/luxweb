'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import Link from 'next/link'
import { faqData } from '@/data/faq'

export default function FAQCondensed() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Show first 4 FAQs
  const faqs = faqData.slice(0, 4)

  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="container mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Questions? <span className="text-gradient-purple">Answers.</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 mb-10">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card-subtle p-5 cursor-pointer hover:border-white/10 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-white/5">
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Have more questions?{' '}
              <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Get in touch
              </Link>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
