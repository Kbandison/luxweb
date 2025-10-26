'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ComposeEmailModal } from './ComposeEmailModal'
import { Mail, FileText, Plus, Send } from 'lucide-react'

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

interface EmailTemplatesQuickProps {
  templates: EmailTemplate[]
  clients: Client[]
}

export function EmailTemplatesQuick({ templates, clients }: EmailTemplatesQuickProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  const handleQuickSend = (template: EmailTemplate) => {
    setSelectedTemplate(template)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Email Templates
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No email templates yet</p>
          <Button 
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.slice(0, 5).map((template) => (
            <div 
              key={template.id}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm mb-1 truncate">
                    {template.name}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {template.subject}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.template_type === 'invoice' 
                        ? 'bg-blue-600/20 text-blue-400'
                        : template.template_type === 'proposal'
                        ? 'bg-green-600/20 text-green-400'
                        : template.template_type === 'follow_up'
                        ? 'bg-orange-600/20 text-orange-400'
                        : 'bg-purple-600/20 text-purple-400'
                    }`}>
                      {template.template_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <ComposeEmailModal clients={clients} emailTemplates={[template]}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </ComposeEmailModal>
              </div>
            </div>
          ))}

          {templates.length > 5 && (
            <div className="pt-3 border-t border-white/10">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                View All Templates ({templates.length})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}