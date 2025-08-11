'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface CreateClientModalProps {
  children: React.ReactNode
}

export function CreateClientModal({ children }: CreateClientModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    company_name: '',
    primary_contact: '',
    email: '',
    phone: '',
    address: '',
    website_url: '',
    notes: '',
    brand_colors: {
      primary: '#2d1b69',
      secondary: '#7c3aed',
      accent: '#d4b3ff'
    },
    communication_preferences: {
      email: true,
      sms: false,
      preferred_time: 'business_hours'
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create client')
      }

      setIsOpen(false)
      setFormData({
        company_name: '',
        primary_contact: '',
        email: '',
        phone: '',
        address: '',
        website_url: '',
        notes: '',
        brand_colors: {
          primary: '#2d1b69',
          secondary: '#7c3aed',
          accent: '#d4b3ff'
        },
        communication_preferences: {
          email: true,
          sms: false,
          preferred_time: 'business_hours'
        }
      })
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Client</h2>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Primary Contact *
              </label>
              <Input
                value={formData.primary_contact}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_contact: e.target.value }))}
                required
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Company Name *
              </label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                required
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Website URL
              </label>
              <Input
                value={formData.website_url}
                onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>

          {/* Communication Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Communication Preferences
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="email-pref"
                  checked={formData.communication_preferences.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    communication_preferences: {
                      ...prev.communication_preferences,
                      email: e.target.checked
                    }
                  }))}
                  className="rounded border-white/20 bg-white/10 text-primary-light focus:ring-primary-light"
                />
                <label htmlFor="email-pref" className="text-sm text-gray-300">
                  Email notifications
                </label>
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="sms-pref"
                  checked={formData.communication_preferences.sms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    communication_preferences: {
                      ...prev.communication_preferences,
                      sms: e.target.checked
                    }
                  }))}
                  className="rounded border-white/20 bg-white/10 text-primary-light focus:ring-primary-light"
                />
                <label htmlFor="sms-pref" className="text-sm text-gray-300">
                  SMS notifications
                </label>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Preferred Contact Time</label>
                <select
                  value={formData.communication_preferences.preferred_time}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    communication_preferences: {
                      ...prev.communication_preferences,
                      preferred_time: e.target.value
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                >
                  <option value="business_hours">Business Hours (9-5)</option>
                  <option value="evenings">Evenings (5-8 PM)</option>
                  <option value="weekends">Weekends</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Brand Colors (for Client Portal)
            </label>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Primary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brand_colors.primary}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      brand_colors: { ...prev.brand_colors, primary: e.target.value }
                    }))}
                    className="w-8 h-8 rounded border border-white/20"
                  />
                  <Input
                    value={formData.brand_colors.primary}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      brand_colors: { ...prev.brand_colors, primary: e.target.value }
                    }))}
                    className="bg-white/10 border-white/20 text-white text-sm"
                    placeholder="#2d1b69"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Secondary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brand_colors.secondary}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      brand_colors: { ...prev.brand_colors, secondary: e.target.value }
                    }))}
                    className="w-8 h-8 rounded border border-white/20"
                  />
                  <Input
                    value={formData.brand_colors.secondary}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      brand_colors: { ...prev.brand_colors, secondary: e.target.value }
                    }))}
                    className="bg-white/10 border-white/20 text-white text-sm"
                    placeholder="#7c3aed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brand_colors.accent}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      brand_colors: { ...prev.brand_colors, accent: e.target.value }
                    }))}
                    className="w-8 h-8 rounded border border-white/20"
                  />
                  <Input
                    value={formData.brand_colors.accent}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      brand_colors: { ...prev.brand_colors, accent: e.target.value }
                    }))}
                    className="bg-white/10 border-white/20 text-white text-sm"
                    placeholder="#d4b3ff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light"
              placeholder="Additional notes about the client..."
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/10">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary-light hover:bg-primary-medium text-white"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}