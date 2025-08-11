'use client'

import { FolderOpen, Receipt, FileText, MessageSquare, Clock, CheckCircle } from 'lucide-react'

interface DashboardStatsProps {
  projects: any[]
  invoices: any[]
  files: any[]
  communications: any[]
}

export function DashboardStats({ projects, invoices, files, communications }: DashboardStatsProps) {
  // Calculate stats
  const activeProjects = projects.filter(p => ['planning', 'in_progress', 'review'].includes(p.status)).length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const pendingInvoices = invoices.filter(i => ['draft', 'sent'].includes(i.status)).length
  const paidInvoices = invoices.filter(i => i.status === 'paid').length
  const totalFiles = files.length
  const unreadMessages = communications.filter(c => !c.client_read).length

  const stats = [
    {
      name: 'Active Projects',
      value: activeProjects.toString(),
      description: `${completedProjects} completed`,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      name: 'Pending Invoices',
      value: pendingInvoices.toString(),
      description: `${paidInvoices} paid`,
      icon: Receipt,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      name: 'Shared Files',
      value: totalFiles.toString(),
      description: 'Ready for download',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      name: 'Messages',
      value: unreadMessages.toString(),
      description: 'Unread messages',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.name}
            className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">{stat.name}</h3>
              <p className="text-gray-400 text-sm">{stat.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}