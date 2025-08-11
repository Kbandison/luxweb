'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Receipt, 
  Search, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileX,
  Download,
  Eye
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface InvoicesListProps {
  invoices: any[]
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

export function InvoicesList({ invoices }: InvoicesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Add overdue status to invoices
  const invoicesWithOverdue = invoices.map(invoice => ({
    ...invoice,
    isOverdue: invoice.status === 'sent' && invoice.due_date && new Date(invoice.due_date) < new Date(),
    displayStatus: invoice.status === 'sent' && invoice.due_date && new Date(invoice.due_date) < new Date() ? 'overdue' : invoice.status
  }))

  // Filter invoices
  const filteredInvoices = invoicesWithOverdue.filter((invoice) => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.project?.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.displayStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleDownloadPDF = (invoiceId: string, invoiceNumber: string) => {
    // TODO: Implement PDF download
    console.log('Download PDF for invoice:', invoiceId, invoiceNumber)
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
        <div className="text-center">
          <Receipt className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Invoices Yet</h3>
          <p className="text-gray-400 mb-6">
            Your invoices will appear here once they're created by your development team.
          </p>
          <Button
            onClick={() => window.location.href = '/portal/communications'}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Contact Your Team
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="all" className="text-white">All Statuses</SelectItem>
              <SelectItem value="draft" className="text-white">Draft</SelectItem>
              <SelectItem value="sent" className="text-white">Sent</SelectItem>
              <SelectItem value="paid" className="text-white">Paid</SelectItem>
              <SelectItem value="overdue" className="text-white">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Invoice</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Project</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Due Date</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.displayStatus as keyof typeof statusConfig] || statusConfig.draft
                const Icon = status.icon

                return (
                  <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/portal/invoices/${invoice.id}`}>
                        <div className="hover:text-white transition-colors">
                          <p className="text-white font-medium">{invoice.invoice_number}</p>
                          <p className="text-gray-400 text-sm">
                            {formatDistanceToNow(new Date(invoice.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">
                        {invoice.project?.project_name || 'General Invoice'}
                      </p>
                      {invoice.project?.project_type && (
                        <p className="text-gray-400 text-sm capitalize">
                          {invoice.project.project_type} Package
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">
                        ${invoice.total_amount?.toLocaleString() || '0.00'}
                      </p>
                      {invoice.tax_amount > 0 && (
                        <p className="text-gray-400 text-sm">
                          +${invoice.tax_amount.toLocaleString()} tax
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.due_date ? (
                        <div>
                          <p className={`text-sm ${invoice.isOverdue ? 'text-red-400' : 'text-white'}`}>
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                          {invoice.isOverdue && (
                            <p className="text-red-400 text-xs">
                              {Math.ceil((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 3600 * 24))} days overdue
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No due date</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg ${status.bgColor} ${status.borderColor} border`}>
                        <Icon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/portal/invoices/${invoice.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadPDF(invoice.id, invoice.invoice_number)}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredInvoices.length === 0 && invoices.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
          <div className="text-center">
            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Invoices Found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}