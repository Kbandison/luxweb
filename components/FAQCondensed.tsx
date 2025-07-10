'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

export default function FAQCondensed() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How long does it take to build my website?",
      answer: "Most websites are completed within 1-3 weeks depending on the package. We'll give you a specific timeline during our consultation."
    },
    {
      question: "Do you build mobile-responsive websites?",
      answer: "Yes, every website we build is fully responsive and optimized for mobile devices. We follow a mobile-first approach to ensure your site works perfectly on all screen sizes."
    },
    {
      question: "What's included in your packages?",
      answer: "Our packages range from simple single-page sites to complex web applications with databases and payment processing. Each includes professional design, SEO optimization, and post-launch support."
    },
    {
      question: "Do you provide support after launch?",
      answer: "Yes! All packages include post-launch support ranging from 30 days to 6 months depending on your package. This includes bug fixes, minor updates, and technical support."
    },
    {
      question: "Do I own the website after it's completed?",
      answer: "Absolutely! You own your website completely. We'll provide you with all files, source code, and login credentials. You're free to host it anywhere or make future changes."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Common <span className="text-purple-400">Questions</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Get quick answers to the most important questions about our web development services.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="modern-card p-6 cursor-pointer hover:border-purple-400/50 transition-all duration-200"
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10 mt-4">
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Have more questions? Check out our complete FAQ or get in touch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/pricing#faq" 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                View All FAQs →
              </a>
              <a 
                href="/contact" 
                className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}