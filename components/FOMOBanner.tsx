'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Clock, Users, Flame, X } from 'lucide-react'

export default function FOMOBanner() {
  const [showBanner, setShowBanner] = useState(() => {
    // Check if user has dismissed banner in this session
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('fomoBannerDismissed')
    }
    return true
  })
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white relative overflow-hidden z-50"
          data-fomo-banner
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 animate-pulse" />
                  <span className="font-semibold">Limited Time:</span>
                  <span>Save up to $700 on all packages</span>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Ends in:</span>
                  <div className="flex gap-1">
                    <span className="bg-white/20 px-2 py-1 rounded text-xs font-mono">
                      {timeLeft.hours.toString().padStart(2, '0')}h
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded text-xs font-mono">
                      {timeLeft.minutes.toString().padStart(2, '0')}m
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded text-xs font-mono">
                      {timeLeft.seconds.toString().padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Only 3 spots left this month</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowBanner(false)
                  sessionStorage.setItem('fomoBannerDismissed', 'true')
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}