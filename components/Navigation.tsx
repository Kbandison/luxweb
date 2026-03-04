'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
        style={{
          background: isScrolled ? 'rgba(1, 4, 9, 0.95)' : 'rgba(1, 4, 9, 0.6)',
          backdropFilter: 'blur(30px)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between h-10 md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-400 transition-colors z-[60] flex items-center justify-center h-10 w-10"
              whileTap={{ scale: 0.9 }}
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
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <Link href="/">
              <Image
                src="/logo-icon.png"
                alt="LuxWeb Studio"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </Link>

            <Link href="/contact">
              <Button className="modern-btn-primary text-white px-3 py-1.5 text-xs font-medium h-auto">
                Free Quote
              </Button>
            </Link>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex md:items-center md:justify-between h-12">
            <Link href="/">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                <Image
                  src="/logo-with-text.png"
                  alt="LuxWeb Studio"
                  width={180}
                  height={45}
                  className="h-11 w-auto"
                />
              </motion.div>
            </Link>

            <div className="flex items-center gap-1 relative">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="relative px-4 py-2">
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            <Link href="/contact">
              <Button className="modern-btn-primary text-white px-5 py-2 text-sm font-medium h-auto">
                Get a Free Quote
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[55] md:hidden flex flex-col items-center justify-center"
            initial={{ clipPath: 'circle(0% at 24px 28px)' }}
            animate={{ clipPath: 'circle(150% at 24px 28px)' }}
            exit={{ clipPath: 'circle(0% at 24px 28px)' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: 'rgba(1, 4, 9, 0.98)',
              backdropFilter: 'blur(30px)',
            }}
          >
            <nav className="flex flex-col items-center gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl font-semibold transition-colors ${
                      pathname === item.href ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="modern-btn-primary text-white px-8 py-3 text-base font-medium h-auto">
                  Get a Free Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
