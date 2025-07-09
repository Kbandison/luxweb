'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Download, Gift, ArrowRight, CheckCircle } from 'lucide-react'

export default function LeadMagnet() {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem('leadMagnetSeen')
      if (!hasSeenPopup) {
        setShowPopup(true)
        sessionStorage.setItem('leadMagnetSeen', 'true')
      }
    }, 15000) // Show after 15 seconds

    // Show on exit intent (simplified version)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('leadMagnetSeen')) {
        setShowPopup(true)
        sessionStorage.setItem('leadMagnetSeen', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    
    // Auto close after success
    setTimeout(() => {
      setShowPopup(false)
    }, 3000)
  }

  const handleClose = () => {
    setShowPopup(false)
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="modern-card p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {!isSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Get Your FREE Website Audit
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Discover exactly what's stopping your website from converting visitors into customers. 
                  Get a detailed analysis worth $500 - completely free.
                </p>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>What You'll Get:</span>
                  </div>
                  <ul className="text-left text-sm text-gray-300 space-y-1">
                    <li>• Conversion rate optimization checklist</li>
                    <li>• Mobile responsiveness analysis</li>
                    <li>• SEO improvement recommendations</li>
                    <li>• Competitor comparison report</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full modern-btn-primary text-white py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get My Free Audit
                        <Download className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                  No spam. Unsubscribe anytime. Usually delivered within 24 hours.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Check Your Email!
                </h3>
                
                <p className="text-gray-300 mb-6">
                  Your free website audit is on its way to <span className="text-green-400 font-medium">{email}</span>. 
                  We'll also send you bonus tips to increase your conversion rate.
                </p>

                <Button
                  onClick={handleClose}
                  className="modern-btn-secondary text-white px-8"
                >
                  Continue Browsing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}