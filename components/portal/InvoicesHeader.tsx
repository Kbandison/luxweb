'use client'

import { Receipt, Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react'

interface InvoicesHeaderProps {
  invoices: any[]
}

export function InvoicesHeader({ invoices }: InvoicesHeaderProps) {
  // Calculate invoice stats
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter(i => i.status === 'paid').length
  const pendingInvoices = invoices.filter(i => ['draft', 'sent'].includes(i.status)).length
  const overdueInvoices = invoices.filter(i => {
    return i.status === 'sent' && i.due_date && new Date(i.due_date) < new Date()
  }).length

  // Calculate amounts
  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
  const paidAmount = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
  const pendingAmount = invoices
    .filter(i => ['draft', 'sent'].includes(i.status))
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0)

  const stats = [
    {
      name: 'Total Invoices',
      value: totalInvoices,
      amount: totalAmount,
      icon: Receipt,
      color: 'text-white',
      bgColor: 'bg-white/10'
    },
    {
      name: 'Paid',
      value: paidInvoices,
      amount: paidAmount,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      name: 'Pending',
      value: pendingInvoices,
      amount: pendingAmount,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Overdue',
      value: overdueInvoices,
      amount: invoices
        .filter(i => i.status === 'sent' && i.due_date && new Date(i.due_date) < new Date())
        .reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Your Invoices</h1>
        <p className="text-gray-400">
          View billing details and payment status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`${stat.bgColor} border border-white/10 rounded-2xl p-6`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className={`w-4 h-4 ${stat.color}`} />
                <p className={`font-semibold ${stat.color}`}>
                  ${stat.amount.toLocaleString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}