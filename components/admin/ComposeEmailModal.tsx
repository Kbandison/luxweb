'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Send, Users, FileText } from 'lucide-react'

interface Client {
  id: string
  primary_contact: string
  company_name: string
  email: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  template_type: string
}

interface ComposeEmailModalProps {
  children: React.ReactNode
  clients: Client[]
  emailTemplates: EmailTemplate[]
}

export function ComposeEmailModal({ children, clients, emailTemplates }: ComposeEmailModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    client_id: '',
    subject: '',
    message: '',
    template_id: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      setFormData(prev => ({
        ...prev,
        template_id: templateId,
        subject: template.subject
      }))
    }
  }

  const handleSend = async () => {
    if (!formData.client_id || !formData.subject || !formData.message) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      const successDiv = document.createElement('div')
      successDiv.innerHTML = `
        <div class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          📧 Email sent successfully!
        </div>
      `
      document.body.appendChild(successDiv)
      
      setTimeout(() => {
        document.body.removeChild(successDiv)
      }, 3000)

      // Reset form and close modal
      setFormData({
        client_id: '',
        subject: '',
        message: '',
        template_id: ''
      })
      setOpen(false)
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedClient = clients.find(c => c.id === formData.client_id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Compose Email</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Client Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Select Client</Label>
              <select
                value={formData.client_id}
                onChange={(e) => handleInputChange('client_id', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary-light focus:outline-none"
              >
                <option value="" className="bg-gray-900">Select a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id} className="bg-gray-900">
                    {client.primary_contact} - {client.company_name}
                  </option>
                ))}
              </select>
              {selectedClient && (
                <p className="text-sm text-gray-400 mt-1">
                  📧 {selectedClient.email}
                </p>
              )}
            </div>

            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Use Template (Optional)</Label>
              <select
                value={formData.template_id}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary-light focus:outline-none"
              >
                <option value="" className="bg-gray-900">No template</option>
                {emailTemplates.map(template => (
                  <option key={template.id} value={template.id} className="bg-gray-900">
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label className="text-white text-sm font-medium mb-2 block">Subject</Label>
            <Input
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="Enter email subject..."
            />
          </div>

          {/* Message */}
          <div>
            <Label className="text-white text-sm font-medium mb-2 block">Message</Label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
              placeholder="Type your message here..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSend}
              disabled={loading}
              className="bg-primary-light hover:bg-primary-medium text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}