'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import ScrollReveal from "./ScrollReveal"

export default function Contact() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-populate package from URL parameter
  useEffect(() => {
    const packageParam = searchParams.get('package')
    if (packageParam) {
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
    if (!formData.message.trim()) newErrors.message = 'Please tell us about your project'
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to submit form')

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', company: '', project_type: '', message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Let&apos;s Talk About Your Project
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tell us what you need and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} amount={0.15}>
          <div className="glass-card-subtle p-6 md:p-10">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-400/10 border border-green-400/20 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-green-400 text-sm">Message sent!</div>
                  <div className="text-xs text-gray-400">We&apos;ll get back to you within 24 hours.</div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="font-medium text-red-400 text-sm">Something went wrong.</div>
                  <div className="text-xs text-gray-400">Please try again or email us directly.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-1.5">Name *</label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-400/50"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">Email *</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-400/50"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-400 mb-1.5">Phone</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-400/50"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm text-gray-400 mb-1.5">Company</label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-400/50"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              {/* Package */}
              <div>
                <label htmlFor="project_type" className="block text-sm text-gray-400 mb-1.5">Interested Package</label>
                <select
                  id="project_type"
                  value={formData.project_type}
                  onChange={(e) => handleInputChange('project_type', e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50 text-sm"
                >
                  <option value="" className="bg-gray-900 text-white">Not sure yet</option>
                  <option value="starter" className="bg-gray-900 text-white">Starter Package</option>
                  <option value="growth" className="bg-gray-900 text-white">Growth Package</option>
                  <option value="complete" className="bg-gray-900 text-white">Complete Package</option>
                  <option value="enterprise" className="bg-gray-900 text-white">Enterprise Package</option>
                </select>
                <p className="text-gray-600 text-xs mt-1">We&apos;ll discuss the best fit during your free consultation</p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm text-gray-400 mb-1.5">Tell us about your project *</label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-400/50"
                  placeholder="What kind of website do you need? What are your goals?"
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full modern-btn-primary text-white font-semibold py-5 text-base disabled:opacity-50 disabled:cursor-not-allowed h-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send My Message
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-600 text-xs">
                Or email us at{' '}
                <a href="mailto:support@luxwebstudio.dev" className="text-purple-400 hover:text-purple-300 transition-colors">
                  support@luxwebstudio.dev
                </a>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
