import { supabaseAdmin } from '@/lib/supabase-server'
import { TemplatesGrid } from '@/components/admin/TemplatesGrid'
import { CreateTemplateModal } from '@/components/admin/CreateTemplateModal'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Mail } from 'lucide-react'

async function getTemplatesData() {
  try {
    // Get contract templates
    const { data: contractTemplates, error: contractError } = await supabaseAdmin
      .from('contract_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (contractError) {
      console.error('Error fetching contract templates:', contractError)
    }

    // Get email templates (we'll create this table)
    const { data: emailTemplates, error: emailError } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (emailError) {
      console.error('Error fetching email templates:', emailError)
    }

    return {
      contractTemplates: contractTemplates || [],
      emailTemplates: emailTemplates || []
    }
  } catch (error) {
    console.error('Error in getTemplatesData:', error)
    return {
      contractTemplates: [],
      emailTemplates: []
    }
  }
}

export default async function TemplatesPage() {
  const { contractTemplates, emailTemplates } = await getTemplatesData()

  const stats = {
    totalTemplates: contractTemplates.length + emailTemplates.length,
    contractTemplates: contractTemplates.length,
    emailTemplates: emailTemplates.length,
    recentlyUsed: contractTemplates.filter(t => {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return new Date(t.updated_at || t.created_at) > oneWeekAgo
    }).length
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Templates</h1>
          <p className="text-gray-400">Manage contract templates, email templates, and document templates</p>
        </div>
        <div className="flex items-center space-x-3">
          <CreateTemplateModal type="email">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Mail className="w-4 h-4 mr-2" />
              New Email Template
            </Button>
          </CreateTemplateModal>
          <CreateTemplateModal type="contract">
            <Button className="bg-primary-light hover:bg-primary-medium text-white">
              <FileText className="w-4 h-4 mr-2" />
              New Contract Template
            </Button>
          </CreateTemplateModal>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalTemplates}</p>
              <p className="text-gray-400 text-sm">Total Templates</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.contractTemplates}</p>
              <p className="text-gray-400 text-sm">Contract Templates</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.emailTemplates}</p>
              <p className="text-gray-400 text-sm">Email Templates</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.recentlyUsed}</p>
              <p className="text-gray-400 text-sm">Recently Updated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <TemplatesGrid 
        contractTemplates={contractTemplates}
        emailTemplates={emailTemplates}
      />
    </div>
  )
}