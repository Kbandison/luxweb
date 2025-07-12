'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { href: '/', label: 'Home', isExternal: true },
    { href: '/projects', label: 'Projects', isExternal: true },
    { href: '/pricing', label: 'Pricing', isExternal: true },
    { href: '/contact', label: 'Contact', isExternal: true },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.isExternal) {
      return // Link component will handle navigation
    }
    scrollToSection(item.href)
  }

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? 'glass-nav' : ''
      }`} 
      style={{
        background: isScrolled ? undefined : 'rgba(22, 5, 40, 0.05)',
        backdropFilter: 'blur(30px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between relative h-12 md:hidden">
          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-purple-400 transition-all duration-300 ease-out cursor-pointer z-10 flex items-center justify-center h-12 w-12"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Logo - Center */}
          <Link href="/">
            <motion.div 
              className="cursor-pointer absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/logo-icon.png"
                alt="LuxWeb Studio"
                width={44}
                height={44}
                className="w-11 h-11"
              />
            </motion.div>
          </Link>

          {/* Mobile CTA Button */}
          <motion.div
            className="z-10 flex items-center h-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/contact">
              <Button
                className="modern-btn-primary text-white px-3 py-2 text-xs font-medium cursor-pointer"
              >
                Discuss My Project
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {/* Desktop Logo - Left */}
          <Link href="/">
            <motion.div 
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/logo-with-text.png"
                alt="LuxWeb Studio"
                width={220}
                height={55}
                className="h-14 w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Menu - Center */}
          <motion.div 
            className="flex items-center space-x-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {menuItems.map((item, index) => (
              item.isExternal ? (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="text-white hover:text-purple-400 transition-all duration-300 ease-out font-medium cursor-pointer px-3 py-2 rounded-lg hover:bg-white/5"
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ) : (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white hover:text-purple-400 transition-all duration-300 ease-out font-medium cursor-pointer px-3 py-2 rounded-lg hover:bg-white/5"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              )
            ))}
          </motion.div>

          {/* Desktop CTA Button - Right */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/contact">
              <Button
                className="modern-btn-primary text-white px-6 py-2 text-sm font-medium cursor-pointer"
              >
                Discuss My Project
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 pb-4 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3,  }}
            >
              <motion.div 
                className="flex flex-col space-y-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {menuItems.map((item, index) => (
                  item.isExternal ? (
                    <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                      <motion.div
                        className="text-white hover:text-purple-400 transition-all duration-300 ease-out font-medium text-left py-2 cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: 0.1 + index * 0.1 }}
                        whileHover={{ 
                          x: 5,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.label}
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className="text-white hover:text-purple-400 transition-all duration-300 ease-out font-medium text-left py-2 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: 0.1 + index * 0.1 }}
                      whileHover={{ 
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  )
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}