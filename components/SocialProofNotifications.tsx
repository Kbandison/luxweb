'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle, MapPin } from 'lucide-react'

interface Notification {
  id: number
  name: string
  location: string
  package: string
  timeAgo: string
}

export default function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const notifications: Notification[] = [
    { id: 1, name: "Sarah M.", location: "New York", package: "Growth Package", timeAgo: "2 minutes ago" },
    { id: 2, name: "Mike C.", location: "California", package: "Complete Package", timeAgo: "5 minutes ago" },
    { id: 3, name: "Lisa R.", location: "Texas", package: "Starter Package", timeAgo: "8 minutes ago" },
    { id: 4, name: "David K.", location: "Florida", package: "Growth Package", timeAgo: "12 minutes ago" },
    { id: 5, name: "Amy T.", location: "Illinois", package: "Enterprise Package", timeAgo: "15 minutes ago" },
    { id: 6, name: "John P.", location: "Washington", package: "Complete Package", timeAgo: "18 minutes ago" }
  ]

  useEffect(() => {
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      setCurrentNotification(randomNotification)
      setIsVisible(true)

      setTimeout(() => {
        setIsVisible(false)
      }, 4000)
    }

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000)

    // Then show notifications every 8-12 seconds
    const intervalTimer = setInterval(() => {
      const randomDelay = 8000 + Math.random() * 4000
      setTimeout(showNotification, randomDelay)
    }, 12000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(intervalTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.3
          }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="modern-card p-4 border border-green-500/30 bg-green-500/5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">
                    {currentNotification.name}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>{currentNotification.location}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-1">
                  Just purchased the <span className="text-green-400 font-medium">{currentNotification.package}</span>
                </p>
                
                <div className="text-xs text-gray-500">
                  {currentNotification.timeAgo}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}