'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { businessPhone } from "@/data/contact"
import CtaButton from "./CtaButton"
import PhoneLink from "./PhoneLink"

interface NavigationProps {
  ctaLabel: string
  /** Fits the narrow mobile bar. */
  ctaShortLabel: string
}

export default function Navigation({ ctaLabel, ctaShortLabel }: NavigationProps) {
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
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
        style={{
          // Sits below the promo announcement bar when one is running.
          top: 'var(--promo-offset, 0px)',
          background: isScrolled ? 'rgba(1, 4, 9, 0.95)' : 'rgba(1, 4, 9, 0.6)',
          backdropFilter: 'blur(30px)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent'
        }}
      >
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between h-11 md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="text-white hover:text-purple-400 transition-colors z-[60] flex items-center justify-center h-11 w-11"
              whileTap={{ scale: 0.9 }}
            >
              {/* initial={false}: the icon paints on first render instead of fading in after hydration. */}
              <AnimatePresence mode="wait" initial={false}>
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

            <div className="flex items-center gap-1.5">
              {/* Tap-to-call. Icon-only to keep the bar from crowding on
                  narrow phones; the full number is in the menu overlay. */}
              <PhoneLink
                location="nav_mobile"
                aria-label={`Call ${businessPhone.display}`}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:text-purple-400 active:scale-95"
              >
                <Phone size={18} />
              </PhoneLink>

              <CtaButton
                label={ctaShortLabel}
                location="nav_mobile"
                className="min-h-11 px-3.5 text-sm font-medium [&_svg]:hidden"
              />
            </div>
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

            <CtaButton label={ctaLabel} location="nav_desktop" className="px-5 py-2 text-sm font-medium" />
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
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
              <div onClick={() => setIsMenuOpen(false)}>
                <CtaButton label={ctaLabel} location="nav_menu" className="px-8 py-3 text-base font-medium" />
              </div>
            </motion.div>

            {/* Full number here — visitors who prefer calling shouldn't have
                to hunt for it in the footer. */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.48, duration: 0.4 }}
            >
              <PhoneLink
                location="nav_menu"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-gray-400 transition-colors hover:text-purple-400"
              >
                <Phone className="h-4 w-4" />
                {businessPhone.display}
              </PhoneLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
