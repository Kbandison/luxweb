'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LogoCarousel() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sample client logos - you can replace these with actual client logos
  const logos = [
    { name: 'TechStart Solutions', logo: 'TS' },
    { name: 'Urban Bakery', logo: 'UB' },
    { name: 'Green Valley Health', logo: 'GVH' },
    { name: 'Metro Consulting', logo: 'MC' },
    { name: 'Bright Future Academy', logo: 'BFA' },
    { name: 'Coastal Realty', logo: 'CR' },
    { name: 'Innovation Labs', logo: 'IL' },
    { name: 'Summit Financial', logo: 'SF' },
    { name: 'Digital Dreams', logo: 'DD' },
    { name: 'Peak Performance', logo: 'PP' }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  if (!mounted) return null

  return (
    <motion.div
      className="w-full py-12 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="text-center mb-8">
        <motion.p 
          className="text-gray-400 text-sm font-medium"
          variants={logoVariants}
        >
          Trusted by growing businesses
        </motion.p>
      </div>
      
      <div className="relative">
        <div className="flex animate-infinite-scroll">
          {/* First set of logos */}
          <div className="flex space-x-8 flex-shrink-0">
            {logos.map((logo, index) => (
              <motion.div
                key={`set1-${logo.name}-${index}`}
                className="flex-shrink-0 w-32 h-16 flex items-center justify-center"
                variants={logoVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/10 flex items-center justify-center backdrop-blur-sm hover:border-purple-400/30 transition-all duration-300">
                  <span className="text-white font-bold text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {logo.logo}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second set of logos for seamless loop */}
          <div className="flex space-x-8 flex-shrink-0">
            {logos.map((logo, index) => (
              <motion.div
                key={`set2-${logo.name}-${index}`}
                className="flex-shrink-0 w-32 h-16 flex items-center justify-center"
                variants={logoVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/10 flex items-center justify-center backdrop-blur-sm hover:border-purple-400/30 transition-all duration-300">
                  <span className="text-white font-bold text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {logo.logo}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}