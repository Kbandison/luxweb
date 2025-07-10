'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How long does it take to build my website?",
      answer: "Most websites are completed within 1-3 weeks depending on the package. Starter packages take about 1 week, Growth packages 2 weeks, and Complete/Enterprise packages 2-3+ weeks. We'll give you a specific timeline during our consultation."
    },
    {
      question: "Do you provide ongoing support after launch?",
      answer: "Yes! All packages include post-launch support ranging from 30 days (Starter) to 6 months (Enterprise). This includes bug fixes, minor updates, and technical support. We also offer ongoing maintenance plans for long-term support."
    },
    {
      question: "Can I make changes during the development process?",
      answer: "Absolutely! We encourage feedback throughout the process. Minor changes and refinements are included in all packages. Major scope changes may require timeline and cost adjustments, which we'll discuss upfront."
    },
    {
      question: "What if I'm not satisfied with the final result?",
      answer: "Your satisfaction is our priority. We work closely with you throughout the process to ensure the website meets your expectations. We offer revisions during development and will work with you to address any concerns."
    },
    {
      question: "Do you build mobile-responsive websites?",
      answer: "Yes, every website we build is fully responsive and optimized for mobile devices. We follow a mobile-first approach to ensure your site looks and works perfectly on all screen sizes."
    },
    {
      question: "What's included in SEO optimization?",
      answer: "Our SEO optimization includes proper HTML structure, meta tags, fast loading speeds, mobile optimization, and basic on-page SEO. Growth and higher packages include more advanced SEO setup and analytics integration."
    },
    {
      question: "Do I own the website after it's completed?",
      answer: "Yes, you own your website completely. We'll provide you with all the files, source code, and any necessary login credentials. You're free to host it anywhere or make future changes as needed."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. For larger projects, we offer payment plans with 50% upfront and 50% upon completion. We'll discuss payment options during our consultation."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Frequently Asked <span className="text-purple-400">Questions</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Get answers to the most common questions about our web development process and services.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="space-y-4">
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
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              Still have questions? We're here to help!
            </p>
            <a href="/contact" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
              Get in touch with us →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}