'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Download, ArrowRight, Star, Users } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

export default function InlineLeadMagnet() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <ScrollReveal>
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modern-card p-8 md:p-12 text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Thanks! Check Your Email
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                We've sent the website planning guide to <span className="text-green-400 font-medium">{email}</span>. 
                You should receive it within the next few minutes. Happy planning!
              </p>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    )
  }

  return (
    <ScrollReveal>
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="modern-card p-8 md:p-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Content */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    FREE GUIDE
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Helpful resource for planning your website</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Website Planning Made Simple
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Planning a new website can feel overwhelming. We've created a simple guide to help you 
                  think through what you need and organize your thoughts before we chat.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Questions to help clarify your goals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Simple content planning worksheets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Tips for gathering your materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Helpful examples and inspiration</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>A helpful resource we're happy to share</span>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email-inline" className="block text-sm font-medium text-gray-300 mb-2">
                      Get the free planning guide
                    </label>
                    <Input
                      id="email-inline"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full modern-btn-primary text-white py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Me The Guide
                        <Download className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  No spam. We respect your privacy. Unsubscribe anytime.
                </p>

                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="text-xs text-yellow-400 text-center">
                    🎯 Bonus: Get our weekly conversion tips newsletter (optional)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}