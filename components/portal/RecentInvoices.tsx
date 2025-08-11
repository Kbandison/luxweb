'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Receipt, ArrowRight, Clock, CheckCircle, AlertTriangle, FileX } from 'lucide-react'

interface RecentInvoicesProps {
  invoices: any[]
}

const statusConfig = {
  draft: {
    icon: FileX,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    label: 'Draft'
  },
  sent: {
    icon: Clock,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    label: 'Sent'
  },
  paid: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    label: 'Paid'
  },
  overdue: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    label: 'Overdue'
  }
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const recentInvoices = invoices.slice(0, 5)

  if (invoices.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Invoices</h2>
        </div>
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No invoices yet</p>
          <p className="text-gray-500 text-sm">Your invoices will appear here once they're created.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Invoices</h2>
        <Link href="/portal/invoices">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {recentInvoices.map((invoice) => {
          const status = statusConfig[invoice.status as keyof typeof statusConfig] || statusConfig.draft
          const Icon = status.icon
          const isOverdue = invoice.status === 'sent' && invoice.due_date && new Date(invoice.due_date) < new Date()
          const displayStatus = isOverdue ? statusConfig.overdue : status

          return (
            <Link key={invoice.id} href={`/portal/invoices/${invoice.id}`}>
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg ${displayStatus.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${displayStatus.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium group-hover:text-white">
                      {invoice.invoice_number}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {invoice.due_date ? `Due ${new Date(invoice.due_date).toLocaleDateString()}` : 'No due date'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold">
                    ${invoice.total_amount?.toLocaleString() || '0.00'}
                  </p>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg ${displayStatus.bgColor}`}>
                    <span className={`text-xs font-medium ${displayStatus.color}`}>
                      {displayStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}