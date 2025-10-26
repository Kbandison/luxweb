'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { AlertTriangle, FileText, Mail } from 'lucide-react'

interface CreateTemplateModalProps {
  type: 'contract' | 'email'
  children: React.ReactNode
}

export function CreateTemplateModal({ type, children }: CreateTemplateModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    template_content: '',
    subject: '', // For email templates
    service_type: '', // For contract templates
    template_type: '', // For email templates
    placeholder_fields: '{}',
    variables: '{}',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let templateData: any = {
        name: formData.name,
        template_content: formData.template_content,
        is_active: true
      }

      if (type === 'contract') {
        templateData = {
          ...templateData,
          service_type: formData.service_type || null,
          placeholder_fields: JSON.parse(formData.placeholder_fields || '{}')
        }
      } else {
        templateData = {
          ...templateData,
          subject: formData.subject,
          template_type: formData.template_type,
          variables: JSON.parse(formData.variables || '{}')
        }
      }

      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...templateData
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create template')
      }

      // Reset form and close modal
      setFormData({
        name: '',
        template_content: '',
        subject: '',
        service_type: '',
        template_type: '',
        placeholder_fields: '{}',
        variables: '{}'
      })
      setError(null)
      setOpen(false)
      
      // Refresh the page to show new template
      router.refresh()
      
    } catch (error) {
      console.error('Error creating template:', error)
      setError(error instanceof Error ? error.message : 'Failed to create template')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getDefaultContent = () => {
    if (type === 'contract') {
      return `<h1>Service Agreement</h1>

<p><strong>Client:</strong> \{\{client_name\}\}</p>
<p><strong>Company:</strong> \{\{company_name\}\}</p>
<p><strong>Project:</strong> \{\{project_name\}\}</p>
<p><strong>Total Investment:</strong> $\{\{project_price\}\}</p>
<p><strong>Start Date:</strong> \{\{start_date\}\}</p>
<p><strong>Completion Date:</strong> \{\{completion_date\}\}</p>

<h2>Scope of Work</h2>
<p>Detailed description of services to be provided...</p>

<h2>Terms & Conditions</h2>
<p>Payment terms: \{\{payment_terms\}\}</p>
<p>Additional terms and conditions...</p>

<p><strong>Agreement Date:</strong> \{\{agreement_date\}\}</p>
<p><strong>Client Signature:</strong> _________________________</p>
<p><strong>Service Provider:</strong> LuxWeb Studio</p>`
    } else {
      return `<p>Dear \{\{client_name\}\},</p>

<p>This is a template email. You can customize this content and use variables like:</p>
<ul>
  <li>\{\{client_name\}\} - Client's name</li>
  <li>\{\{project_name\}\} - Project name</li>
  <li>\{\{company_name\}\} - Company name</li>
  <li>\{\{custom_message\}\} - Custom message</li>
</ul>

<p>Best regards,<br>
LuxWeb Studio Team</p>`
    }
  }

  const getDefaultVariables = () => {
    if (type === 'contract') {
      return JSON.stringify({
        "client_name": "text",
        "company_name": "text", 
        "project_name": "text",
        "project_price": "currency",
        "start_date": "date",
        "completion_date": "date",
        "payment_terms": "text",
        "agreement_date": "date"
      }, null, 2)
    } else {
      return JSON.stringify({
        "client_name": "text",
        "project_name": "text",
        "company_name": "text",
        "custom_message": "text"
      }, null, 2)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-black border border-white/20 max-w-4xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            {type === 'contract' ? (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Create Contract Template
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Create Email Template
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Template Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white text-sm font-medium mb-2 block">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light"
                  placeholder={type === 'contract' ? 'Starter Package Contract' : 'Welcome Email Template'}
                  required
                />
              </div>

              {type === 'email' && (
                <div>
                  <Label htmlFor="subject" className="text-white text-sm font-medium mb-2 block">Email Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light"
                    placeholder="Welcome to LuxWeb Studio!"
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'contract' && (
                <div>
                  <Label htmlFor="service_type" className="text-white text-sm font-medium mb-2 block">Service Type</Label>
                  <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="starter" className="text-white hover:bg-white/10">Starter Package</SelectItem>
                      <SelectItem value="growth" className="text-white hover:bg-white/10">Growth Package</SelectItem>
                      <SelectItem value="complete" className="text-white hover:bg-white/10">Complete Package</SelectItem>
                      <SelectItem value="enterprise" className="text-white hover:bg-white/10">Enterprise Package</SelectItem>
                      <SelectItem value="custom" className="text-white hover:bg-white/10">Custom Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {type === 'email' && (
                <div>
                  <Label htmlFor="template_type" className="text-white text-sm font-medium mb-2 block">Email Type</Label>
                  <Select value={formData.template_type} onValueChange={(value) => handleInputChange('template_type', value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light">
                      <SelectValue placeholder="Select email type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="welcome" className="text-white hover:bg-white/10">Welcome Email</SelectItem>
                      <SelectItem value="invoice" className="text-white hover:bg-white/10">Invoice Email</SelectItem>
                      <SelectItem value="project_update" className="text-white hover:bg-white/10">Project Update</SelectItem>
                      <SelectItem value="completion" className="text-white hover:bg-white/10">Project Completion</SelectItem>
                      <SelectItem value="follow_up" className="text-white hover:bg-white/10">Follow Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Template Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Template Content</h3>
            
            <div>
              <Label htmlFor="template_content" className="text-white text-sm font-medium mb-2 block">
                {type === 'contract' ? 'Contract Content' : 'Email Content'} *
              </Label>
              <Textarea
                id="template_content"
                value={formData.template_content || getDefaultContent()}
                onChange={(e) => handleInputChange('template_content', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light min-h-[300px] font-mono text-sm"
                placeholder={getDefaultContent()}
                required
              />
              <p className="text-xs text-gray-400 mt-2">
                Use HTML tags for formatting. Variables should be in double curly braces like {'{{variable_name}}'}.
              </p>
            </div>
          </div>

          {/* Variables */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Template Variables</h3>
            
            <div>
              <Label htmlFor="variables" className="text-white text-sm font-medium mb-2 block">
                {type === 'contract' ? 'Placeholder Fields' : 'Email Variables'} (JSON Format)
              </Label>
              <Textarea
                id="variables"
                value={type === 'contract' ? formData.placeholder_fields || getDefaultVariables() : formData.variables || getDefaultVariables()}
                onChange={(e) => handleInputChange(type === 'contract' ? 'placeholder_fields' : 'variables', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light min-h-[150px] font-mono text-sm"
                placeholder={getDefaultVariables()}
              />
              <p className="text-xs text-gray-400 mt-2">
                Define variables that can be replaced when using this template. Format: {"{"}"variable_name": "type"{"}"}.
              </p>
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
              disabled={loading || !formData.name || !formData.template_content}
              className="bg-primary-light hover:bg-primary-medium text-white"
            >
              {loading ? 'Creating...' : `Create ${type === 'contract' ? 'Contract' : 'Email'} Template`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}