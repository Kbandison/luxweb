'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  DollarSign, 
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Send
} from 'lucide-react'

interface InvoiceDetailsProps {
  invoice: {
    id: string
    invoice_number: string
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
    amount: number
    tax_amount: number | null
    total_amount: number
    due_date: string | null
    issued_at: string | null
    paid_at: string | null
    description: string | null
    line_items: any[]
    payment_terms: string | null
    created_at: string
    clients: {
      primary_contact: string
      company_name: string | null
      email: string
    } | null
    projects: {
      project_name: string
      project_type: string
    } | null
  }
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const getStatusBadge = (status: InvoiceDetailsProps['invoice']['status']) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary', icon: FileText },
      sent: { label: 'Sent', variant: 'default', icon: Send },
      paid: { label: 'Paid', variant: 'success', icon: CheckCircle },
      overdue: { label: 'Overdue', variant: 'destructive', icon: AlertTriangle },
      cancelled: { label: 'Cancelled', variant: 'outline', icon: XCircle }
    } as const

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isOverdue = () => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled' || !invoice.due_date) return false
    return new Date(invoice.due_date) < new Date()
  }

  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-8 space-y-8">
      {/* Invoice Header */}
      <div className="flex items-start justify-between pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Invoice {invoice.invoice_number}</h2>
          <p className="text-gray-400">
            Created on {formatDate(invoice.created_at)}
          </p>
        </div>
        <div className="text-right">
          {getStatusBadge(invoice.status)}
          {isOverdue() && invoice.status !== 'paid' && (
            <p className="text-red-400 text-sm mt-2 font-medium">OVERDUE</p>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Issue Date</h3>
          <p className="text-white">
            {invoice.issued_at ? formatDate(invoice.issued_at) : 'Not issued'}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Due Date</h3>
          <p className={`${
            isOverdue() && invoice.status !== 'paid' ? 'text-red-400 font-medium' : 'text-white'
          }`}>
            {formatDate(invoice.due_date)}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Terms</h3>
          <p className="text-white">{invoice.payment_terms || 'Net 30'}</p>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Items</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Description</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Qty</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Rate</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.line_items && invoice.line_items.length > 0 ? (
                invoice.line_items.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="py-3 text-white">{item.description}</td>
                    <td className="py-3 text-white text-right">{item.quantity}</td>
                    <td className="py-3 text-white text-right">{formatCurrency(item.rate)}</td>
                    <td className="py-3 text-white text-right font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No line items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.amount)}</span>
          </div>
          
          {invoice.tax_amount && invoice.tax_amount > 0 && (
            <div className="flex justify-between text-gray-300">
              <span>Tax:</span>
              <span>{formatCurrency(invoice.tax_amount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-xl font-semibold text-white border-t border-white/20 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {invoice.paid_at && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">Payment Received</p>
              <p className="text-green-300 text-sm">
                Paid on {formatDate(invoice.paid_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {invoice.description && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Notes</h3>
          <p className="text-gray-300 leading-relaxed">{invoice.description}</p>
        </div>
      )}
    </div>
  )
}