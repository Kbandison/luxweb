'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle, AlertCircle, Clock, Users, Zap, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"

export default function Contact() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    project_goals: '',
    budget_range: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showTooltip, setShowTooltip] = useState(false)
  const [showBudgetTooltip, setShowBudgetTooltip] = useState(false)

  // Auto-populate package from URL parameter
  useEffect(() => {
    const packageParam = searchParams.get('package')
    if (packageParam) {
      // Map package names to form values
      const packageMap: Record<string, string> = {
        'Starter Package': 'starter',
        'Growth Package': 'growth', 
        'Complete Package': 'complete',
        'Enterprise Package': 'enterprise'
      }
      
      const mappedValue = packageMap[packageParam]
      if (mappedValue) {
        setFormData(prev => ({ ...prev, project_type: mappedValue }))
      }
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.project_type) newErrors.project_type = 'Project type is required'
    if (!formData.budget_range) newErrors.budget_range = 'Budget range is required'
    if (!formData.project_goals.trim()) newErrors.project_goals = 'Project goals are required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        project_goals: '',
        budget_range: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Let's Build Your <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Dream Website</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
              Ready to transform your business? Let's discuss your project and create a website that converts visitors into customers.
            </p>
            
            {/* Urgency Elements */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium text-sm">Free Consultation</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">24hr Response Time</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium text-sm">Limited Availability</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} amount={0.15}>
          <motion.div 
            className="glass-card p-8 md:p-12 rounded-2xl"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
          {submitStatus === 'success' && (
            <div className="mb-8 p-4 bg-green-400/10 border border-green-400/20 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-semibold text-green-400">Message Sent Successfully!</div>
                <div className="text-sm text-gray-300">We'll get back to you within 24 hours.</div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-8 p-4 bg-red-400/10 border border-red-400/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <div className="font-semibold text-red-400">Error Sending Message</div>
                <div className="text-sm text-gray-300">Please try again or email us directly.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="glass-card bg-white/5 border-white/20 text-white placeholder-gray-400"
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="glass-card bg-white/5 border-white/20 text-white placeholder-gray-400"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="glass-card bg-white/5 border-white/20 text-white placeholder-gray-400"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="glass-card bg-white/5 border-white/20 text-white placeholder-gray-400"
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="project_type" className="block text-sm font-medium text-gray-300">
                  Project Type *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black/90 border border-purple-400/30 rounded-lg p-3 text-xs text-gray-300 z-50">
                      <div className="text-purple-400 font-medium mb-1">Don't worry about choosing the wrong package!</div>
                      <div>Just pick the one that most aligns with your needs. We'll discuss the perfect fit for your project during our consultation.</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-400/30"></div>
                    </div>
                  )}
                </div>
              </div>
              <select
                value={formData.project_type}
                onChange={(e) => handleInputChange('project_type', e.target.value)}
                className="glass-card bg-white/5 border-white/20 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="" className="bg-black text-white">Select your package</option>
                <option value="starter" className="bg-black text-white">Starter Package</option>
                <option value="growth" className="bg-black text-white">Growth Package</option>
                <option value="complete" className="bg-black text-white">Complete Package</option>
                <option value="enterprise" className="bg-black text-white">Enterprise Package</option>
              </select>
              {errors.project_type && <p className="text-red-400 text-sm mt-1">{errors.project_type}</p>}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="budget_range" className="block text-sm font-medium text-gray-300">
                  Budget Range *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setShowBudgetTooltip(true)}
                    onMouseLeave={() => setShowBudgetTooltip(false)}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  {showBudgetTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black/90 border border-purple-400/30 rounded-lg p-3 text-xs text-gray-300 z-50">
                      <div className="text-purple-400 font-medium mb-1">A guess is totally fine!</div>
                      <div>We understand budgets can be flexible. Just give us a rough idea - no judgment, and we'll work with you to find the best solution.</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-400/30"></div>
                    </div>
                  )}
                </div>
              </div>
              <select
                value={formData.budget_range}
                onChange={(e) => handleInputChange('budget_range', e.target.value)}
                className="glass-card bg-white/5 border-white/20 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="" className="bg-black text-white">Select your budget range</option>
                <option value="under-1k" className="bg-black text-white">Under $1,000</option>
                <option value="1k-3k" className="bg-black text-white">$1,000 - $3,000</option>
                <option value="3k-5k" className="bg-black text-white">$3,000 - $5,000</option>
                <option value="5k-10k" className="bg-black text-white">$5,000 - $10,000</option>
                <option value="10k-plus" className="bg-black text-white">$10,000+</option>
                <option value="discuss" className="bg-black text-white">Let's discuss</option>
              </select>
              {errors.budget_range && <p className="text-red-400 text-sm mt-1">{errors.budget_range}</p>}
            </div>

            <div>
              <label htmlFor="project_goals" className="block text-sm font-medium text-gray-300 mb-2">
                Project Goals *
              </label>
              <Textarea
                id="project_goals"
                value={formData.project_goals}
                onChange={(e) => handleInputChange('project_goals', e.target.value)}
                rows={4}
                className="glass-card bg-white/5 border-white/20 text-white placeholder-gray-400"
                placeholder="What do you hope to achieve with this website? (e.g., increase sales, generate leads, improve brand presence...)"
              />
              {errors.project_goals && <p className="text-red-400 text-sm mt-1">{errors.project_goals}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Details
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className="glass-card bg-white/5 border-white/20 text-white placeholder-gray-400"
                placeholder="Any additional information about your project, timeline, or specific requirements..."
              />
              {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full modern-btn-primary text-white font-semibold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send My Message
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Or email us directly at{' '}
              <a href="mailto:support@luxwebstudio.dev" className="text-green-400 hover:text-green-300 transition-colors duration-300 ease-out">
                support@luxwebstudio.dev
              </a>
            </p>
          </div>
        </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}