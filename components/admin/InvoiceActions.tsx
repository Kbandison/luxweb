'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Send, 
  Edit, 
  Check,
  MoreHorizontal,
  Mail,
  Trash2
} from 'lucide-react'

interface InvoiceActionsProps {
  invoice: {
    id: string
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
    invoice_number: string
    total_amount: number
  }
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleMarkAsPaid = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}/mark-paid`, {
        method: 'POST'
      })
      
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvoice = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}/send`, {
        method: 'POST'
      })
      
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error sending invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    // Placeholder for PDF generation
    alert('PDF download feature coming soon!')
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary Actions */}
      {invoice.status === 'draft' && (
        <>
          <Button 
            onClick={handleSendInvoice}
            disabled={loading}
            className="bg-primary-light hover:bg-primary-light/80"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Invoice
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </>
      )}

      {(invoice.status === 'sent' || invoice.status === 'overdue') && (
        <>
          <Button 
            onClick={handleMarkAsPaid}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark as Paid
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Resend
          </Button>
        </>
      )}

      {/* Always Available Actions */}
      <Button 
        variant="outline" 
        onClick={handleDownload}
      >
        <Download className="w-4 h-4 mr-2" />
        Download PDF
      </Button>

      {/* More Actions Dropdown (placeholder) */}
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  )
}