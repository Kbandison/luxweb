'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  project_id: string | null
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  amount: number
  tax_amount: number | null
  total_amount: number
  due_date: string | null
  issued_at: string | null
  paid_at: string | null
  description: string | null
  line_items: any
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

interface InvoicesListProps {
  invoices: Invoice[]
}

export function InvoicesList({ invoices }: InvoicesListProps) {
  const handleDownloadInvoice = (invoiceId: string, invoiceNumber: string) => {
    // Create a simple text-based invoice download as placeholder for PDF
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return
    
    const content = `LUXWEB STUDIO INVOICE
========================

Invoice: ${invoice.invoice_number}
Date: ${new Date(invoice.created_at).toLocaleDateString()}
Due Date: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}

Bill To:
${invoice.clients?.primary_contact || 'Unknown'}
${invoice.clients?.company_name || ''}
${invoice.clients?.email || ''}

Project: ${invoice.projects?.project_name || 'N/A'}
Description: ${invoice.description || 'No description'}

Amount: ${formatCurrency(invoice.amount)}
Tax: ${formatCurrency(invoice.tax_amount)}
Total: ${formatCurrency(invoice.total_amount)}

Status: ${invoice.status.toUpperCase()}
`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoice.invoice_number}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: Invoice['status']) => {
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
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (status: string, dueDate: string | null) => {
    if (status === 'paid' || status === 'cancelled' || !dueDate) return false
    return new Date(dueDate) < new Date()
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-12 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Invoices Yet</h3>
        <p className="text-gray-400 mb-6">Create your first invoice to get started with billing</p>
      </div>
    )
  }

  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="bg-white/5 px-8 py-5 border-b border-white/10">
        <div className="grid grid-cols-12 gap-6 items-center text-sm font-medium text-gray-300">
          <div className="col-span-2">Invoice #</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Project</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="divide-y divide-white/10">
        {invoices.map((invoice) => {
          const overdueStatus = isOverdue(invoice.status, invoice.due_date)
          
          return (
            <div key={invoice.id} className="px-8 py-6 hover:bg-white/5 transition-colors">
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Invoice Number */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-white">{invoice.invoice_number}</p>
                      <p className="text-xs text-gray-400">{formatDate(invoice.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Client */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-white">
                        {invoice.clients?.primary_contact || 'Unknown'}
                      </p>
                      {invoice.clients?.company_name && (
                        <p className="text-xs text-gray-400">{invoice.clients.company_name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  {overdueStatus && invoice.status !== 'paid' ? (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      Overdue
                    </Badge>
                  ) : (
                    getStatusBadge(invoice.status)
                  )}
                </div>

                {/* Amount */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-white">
                        {formatCurrency(invoice.total_amount)}
                      </p>
                      {invoice.tax_amount && invoice.tax_amount > 0 && (
                        <p className="text-xs text-gray-400">
                          +{formatCurrency(invoice.tax_amount)} tax
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Due Date */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className={`text-sm ${
                        overdueStatus && invoice.status !== 'paid' 
                          ? 'text-red-400 font-medium' 
                          : 'text-gray-300'
                      }`}>
                        {formatDate(invoice.due_date)}
                      </p>
                      {invoice.paid_at && (
                        <p className="text-xs text-green-400">
                          Paid {formatDate(invoice.paid_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project */}
                <div className="col-span-2">
                  {invoice.projects ? (
                    <div>
                      <p className="text-sm font-medium text-white truncate">
                        {invoice.projects.project_name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {invoice.projects.project_type}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No project</p>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/invoices/${invoice.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id, invoice.invoice_number)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}