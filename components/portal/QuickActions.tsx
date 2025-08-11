'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FolderOpen, Receipt, Upload, MessageSquare, FileText, User } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      name: 'View Projects',
      description: 'Check progress & milestones',
      href: '/portal/projects',
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'View Invoices',
      description: 'Check billing & payments',
      href: '/portal/invoices',
      icon: Receipt,
      color: 'from-amber-500 to-amber-600'
    },
    {
      name: 'Browse Files',
      description: 'Download shared files',
      href: '/portal/files',
      icon: FileText,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Send Message',
      description: 'Contact your team',
      href: '/portal/communications',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.name} href={action.href}>
              <Button
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center space-y-3 hover:bg-white/10 group w-full"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-sm group-hover:text-white">
                    {action.name}
                  </p>
                  <p className="text-gray-400 text-xs group-hover:text-gray-300">
                    {action.description}
                  </p>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}