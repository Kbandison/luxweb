'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileX,
  CreditCard,
  Eye
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface InvoiceHeaderProps {
  invoice: any
}

const statusConfig = {
  draft: {
    icon: FileX,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    label: 'Draft'
  },
  sent: {
    icon: Clock,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'Sent'
  },
  paid: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: 'Paid'
  },
  overdue: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Overdue'
  }
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const isOverdue = invoice.status === 'sent' && invoice.due_date && new Date(invoice.due_date) < new Date()
  const displayStatus = isOverdue ? 'overdue' : invoice.status
  const status = statusConfig[displayStatus as keyof typeof statusConfig] || statusConfig.draft
  const StatusIcon = status.icon

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    console.log('Download PDF for invoice:', invoice.id)
  }

  const handlePayInvoice = () => {
    // TODO: Implement payment processing
    console.log('Pay invoice:', invoice.id)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2">
        <Link href="/portal/invoices">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
      </div>

      {/* Invoice Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
          <div className="flex-1 mb-4 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-white">{invoice.invoice_number}</h1>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${status.bgColor} ${status.borderColor} border`}>
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
            
            {invoice.project && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Project</p>
                <p className="text-white text-lg font-medium">{invoice.project.project_name}</p>
                {invoice.project.project_type && (
                  <p className="text-gray-400 text-sm capitalize">
                    {invoice.project.project_type} Package
                  </p>
                )}
              </div>
            )}
            
            {invoice.description && (
              <p className="text-gray-400 leading-relaxed">
                {invoice.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Amount</p>
            <p className="text-4xl font-bold text-white mb-2">
              ${invoice.total_amount?.toLocaleString() || '0.00'}
            </p>
            {invoice.tax_amount > 0 && (
              <p className="text-gray-400 text-sm">
                Includes ${invoice.tax_amount.toLocaleString()} tax
              </p>
            )}
          </div>
        </div>

        {/* Invoice Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Issue Date */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Issue Date</p>
              <p className="text-white font-medium">
                {new Date(invoice.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${isOverdue ? 'bg-red-500/10' : 'bg-amber-500/10'} rounded-lg flex items-center justify-center`}>
              <Calendar className={`w-5 h-5 ${isOverdue ? 'text-red-400' : 'text-amber-400'}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Due Date</p>
              <p className={`font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Not set'}
              </p>
              {isOverdue && (
                <p className="text-red-400 text-xs">
                  {Math.ceil((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 3600 * 24))} days overdue
                </p>
              )}
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Subtotal</p>
              <p className="text-white font-medium">
                ${invoice.amount?.toLocaleString() || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          
          {(invoice.status === 'sent' || isOverdue) && (
            <Button
              onClick={handlePayInvoice}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Invoice
            </Button>
          )}
        </div>

        {/* Created Info */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Invoice created {formatDistanceToNow(new Date(invoice.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  )
}