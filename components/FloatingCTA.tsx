'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (~100vh)
      const pastHero = window.scrollY > window.innerHeight * 0.8
      setVisible(pastHero)
    }

    // Hide when CTA section or footer is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.1 }
    )

    window.addEventListener('scroll', handleScroll)

    // Observe CTA section and footer
    const ctaSection = document.querySelector('#cta-section')
    const footer = document.querySelector('footer')
    if (ctaSection) observer.observe(ctaSection)
    if (footer) observer.observe(footer)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop: floating pill */}
          <motion.div
            className="fixed bottom-6 right-6 z-40 hidden md:block"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/contact">
              <div className="modern-btn-primary text-white px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow duration-300">
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>

          {/* Mobile: full-width bottom bar */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-[rgb(1,4,9)]/95 backdrop-blur-lg border-t border-white/10 px-4 py-3">
              <Link href="/contact">
                <div className="modern-btn-primary text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                  Get a Free Quote
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
