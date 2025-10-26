'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Mail, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Calendar
} from 'lucide-react'

interface ContractTemplate {
  id: string
  name: string
  template_content: string
  placeholder_fields: any
  service_type: string | null
  is_active: boolean
  created_at: string
  updated_at: string | null
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  template_content: string
  template_type: string
  variables: any
  is_active: boolean
  created_at: string
  updated_at: string | null
}

interface TemplatesGridProps {
  contractTemplates: ContractTemplate[]
  emailTemplates: EmailTemplate[]
}

export function TemplatesGrid({ contractTemplates, emailTemplates }: TemplatesGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'contracts' | 'emails'>('all')

  const filteredContractTemplates = activeTab === 'emails' ? [] : contractTemplates
  const filteredEmailTemplates = activeTab === 'contracts' ? [] : emailTemplates

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getTemplateTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'starter': 'Starter Package',
      'growth': 'Growth Package',
      'complete': 'Complete Package',
      'enterprise': 'Enterprise Package',
      'custom': 'Custom Project',
      'welcome': 'Welcome Email',
      'invoice': 'Invoice Email',
      'project_update': 'Project Update',
      'completion': 'Project Completion'
    }
    return typeMap[type] || type
  }

  const handleEditTemplate = (id: string, type: 'contract' | 'email') => {
    // Navigate to template edit page
    window.location.href = `/admin/templates/${id}/edit?type=${type}`
  }

  const handleDuplicateTemplate = async (id: string, type: 'contract' | 'email') => {
    if (!confirm(`Duplicate this ${type} template?`)) return

    try {
      const template = type === 'contract' 
        ? contractTemplates.find(t => t.id === id)
        : emailTemplates.find(t => t.id === id)

      if (!template) {
        alert('Template not found')
        return
      }

      // Create a copy with modified name
      const duplicatedTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        id: undefined, // Remove ID so a new one is generated
        created_at: undefined,
        updated_at: undefined
      }

      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type,
          ...duplicatedTemplate
        }),
      })

      if (response.ok) {
        alert('Template duplicated successfully!')
        window.location.reload() // Refresh to show new template
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error duplicating template:', error)
      alert('Error duplicating template')
    }
  }

  const handleDeleteTemplate = async (id: string, type: 'contract' | 'email') => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      const tableName = type === 'contract' ? 'contract_templates' : 'email_templates'
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: tableName }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handlePreviewTemplate = (template: ContractTemplate | EmailTemplate, type: 'contract' | 'email') => {
    // Create a preview modal/popup
    const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes')
    if (previewWindow) {
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Template Preview - ${template.name}</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                line-height: 1.6; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: #f9fafb;
              }
              .header { 
                background: #1f2937; 
                color: white; 
                padding: 20px; 
                margin: -20px -20px 20px -20px; 
                border-radius: 8px 8px 0 0;
              }
              .content { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${template.name}</h1>
              <p>Type: ${type.charAt(0).toUpperCase() + type.slice(1)} Template</p>
            </div>
            <div class="content">
              ${type === 'email' && 'subject' in template
                ? `<h2>${template.subject}</h2><div>${template.template_content}</div>`
                : template.template_content || 'No content available'}
            </div>
          </body>
        </html>
      `
      previewWindow.document.write(content)
      previewWindow.document.close()
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All Templates', count: contractTemplates.length + emailTemplates.length },
            { id: 'contracts', label: 'Contract Templates', count: contractTemplates.length },
            { id: 'emails', label: 'Email Templates', count: emailTemplates.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-light text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Contract Templates */}
      {filteredContractTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Contract Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContractTemplates.map((template) => (
              <div key={template.id} className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{template.name}</h3>
                      <p className="text-sm text-gray-400">
                        {template.service_type ? getTemplateTypeLabel(template.service_type) : 'General'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template, 'contract')}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      <div className="absolute right-0 top-8 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg py-2 invisible group-hover:visible">
                        <button
                          onClick={() => handleEditTemplate(template.id, 'contract')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Template
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template.id, 'contract')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id, 'contract')}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created {formatDate(template.created_at)}
                    </div>
                    {template.updated_at && (
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Updated {formatDate(template.updated_at)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {Object.keys(template.placeholder_fields || {}).length} variables
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      template.is_active 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Templates */}
      {filteredEmailTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmailTemplates.map((template) => (
              <div key={template.id} className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{template.name}</h3>
                      <p className="text-sm text-gray-400">{getTemplateTypeLabel(template.template_type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template, 'email')}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      <div className="absolute right-0 top-8 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg py-2 invisible group-hover:visible">
                        <button
                          onClick={() => handleEditTemplate(template.id, 'email')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Template
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template.id, 'email')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id, 'email')}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-300">
                    <p className="text-xs text-gray-400 truncate mb-2">
                      Subject: {template.subject}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created {formatDate(template.created_at)}
                    </div>
                    {template.updated_at && (
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Updated {formatDate(template.updated_at)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {Object.keys(template.variables || {}).length} variables
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      template.is_active 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {filteredContractTemplates.length === 0 && filteredEmailTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Templates Found</h3>
          <p className="text-gray-400 mb-4">
            {activeTab === 'all' 
              ? 'Create your first template to get started' 
              : `No ${activeTab} templates found. Create one to get started.`}
          </p>
        </div>
      )}
    </div>
  )
}