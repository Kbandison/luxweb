import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Mail, Building, Calendar, FolderOpen, FileText, CreditCard } from 'lucide-react'

export default function TestClientPortalPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Client Portal Preview</h1>
          <p className="text-gray-400 text-lg">Test different client portal views and functionality</p>
        </div>

        {/* Portal Access Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Dashboard Preview */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Client Dashboard</h3>
                <p className="text-gray-400 text-sm">Main portal overview</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              See the main dashboard with project status, recent activity, and quick actions.
            </p>
            <Link href="/portal/dashboard">
              <Button className="w-full bg-primary-light hover:bg-primary-medium">
                <User className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Projects Preview */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Projects</h3>
                <p className="text-gray-400 text-sm">Project management</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              View project progress, milestones, and collaborate with the team.
            </p>
            <Link href="/portal/projects">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <FolderOpen className="w-4 h-4 mr-2" />
                View Projects
              </Button>
            </Link>
          </div>

          {/* Files Preview */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Files</h3>
                <p className="text-gray-400 text-sm">File management</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Upload, download, and manage project files with version control.
            </p>
            <Link href="/portal/files">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <FileText className="w-4 h-4 mr-2" />
                View Files
              </Button>
            </Link>
          </div>

          {/* Invoices Preview */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Invoices</h3>
                <p className="text-gray-400 text-sm">Billing and payments</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              View invoices, payment history, and manage billing information.
            </p>
            <Link href="/portal/invoices">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <CreditCard className="w-4 h-4 mr-2" />
                View Invoices
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Test Access</h3>
          <p className="text-gray-400 text-sm mb-6">
            These links bypass authentication for testing purposes. In production, clients would log in normally.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/portal/dashboard">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
            <Link href="/portal/projects">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Projects  
              </Button>
            </Link>
            <Link href="/portal/files">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Files
              </Button>
            </Link>
            <Link href="/portal/invoices">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Invoices
              </Button>
            </Link>
          </div>
        </div>

        {/* Back to Admin */}
        <div className="text-center mt-8">
          <Link href="/admin/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              ← Back to Admin Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}