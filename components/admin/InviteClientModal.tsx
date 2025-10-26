'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Mail, Send } from 'lucide-react'

interface InviteClientModalProps {
  children: React.ReactNode
}

export function InviteClientModal({ children }: InviteClientModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    primary_contact: '',
    email: '',
    company_name: '',
    phone: '',
    project_name: '',
    project_type: 'growth',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/clients/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send invitation')
      }

      const result = await response.json()
      setSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          primary_contact: '',
          email: '',
          company_name: '',
          phone: '',
          project_name: '',
          project_type: 'growth',
          message: ''
        })
        setSuccess(false)
        setOpen(false)
        router.refresh()
      }, 2000)
      
    } catch (error) {
      console.error('Error sending invitation:', error)
      setError(error instanceof Error ? error.message : 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const defaultMessage = `Hi ${formData.primary_contact || '[Name]'},

Welcome to LuxWeb Studio! I'm excited to work with you on your ${formData.project_name || 'upcoming project'}.

I've set up a secure client portal where you can:
• Track your project progress in real-time
• Review and approve milestones
• Access project files and deliverables
• View and pay invoices
• Communicate directly with me

You'll receive login credentials in a separate email. If you have any questions, please don't hesitate to reach out.

Looking forward to bringing your vision to life!

Best regards,
LuxWeb Studio Team`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-black border border-white/20 max-w-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Invite New Client
          </DialogTitle>
        </DialogHeader>
        
        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
            <Send className="w-5 h-5 text-green-400" />
            <p className="text-green-400 text-sm">Invitation sent successfully! The client will receive their login credentials via email.</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Client Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_contact" className="text-white text-sm font-medium mb-2 block">Contact Name *</Label>
                <Input
                  id="primary_contact"
                  value={formData.primary_contact}
                  onChange={(e) => handleInputChange('primary_contact', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white text-sm font-medium mb-2 block">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light"
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name" className="text-white text-sm font-medium mb-2 block">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white text-sm font-medium mb-2 block">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Project Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_name" className="text-white text-sm font-medium mb-2 block">Project Name</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => handleInputChange('project_name', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light"
                  placeholder="Company Website Redesign"
                />
              </div>

              <div>
                <Label htmlFor="project_type" className="text-white text-sm font-medium mb-2 block">Project Type</Label>
                <Select value={formData.project_type} onValueChange={(value) => handleInputChange('project_type', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="starter" className="text-white hover:bg-white/10">Starter Package ($1500)</SelectItem>
                    <SelectItem value="growth" className="text-white hover:bg-white/10">Growth Package ($2200)</SelectItem>
                    <SelectItem value="complete" className="text-white hover:bg-white/10">Complete Package ($2800)</SelectItem>
                    <SelectItem value="enterprise" className="text-white hover:bg-white/10">Enterprise Package ($3500+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Invitation Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Invitation Message</h3>
            
            <div>
              <Label htmlFor="message" className="text-white text-sm font-medium mb-2 block">Personal Message</Label>
              <Textarea
                id="message"
                value={formData.message || defaultMessage}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light min-h-[200px]"
                rows={8}
              />
              <p className="text-xs text-gray-400 mt-2">This message will be included in the invitation email along with login instructions.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setError(null)
              }}
              disabled={loading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.primary_contact || !formData.email}
              className="bg-primary-light hover:bg-primary-medium text-white"
            >
              {loading ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}