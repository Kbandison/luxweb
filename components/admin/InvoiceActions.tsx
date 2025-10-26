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
    if (!confirm('Mark this invoice as paid?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}/mark-paid`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Show success message
        const successDiv = document.createElement('div')
        successDiv.innerHTML = `
          <div class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            ✅ Invoice marked as paid successfully!
          </div>
        `
        document.body.appendChild(successDiv)
        
        setTimeout(() => {
          document.body.removeChild(successDiv)
          window.location.reload()
        }, 2000)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to mark as paid'}`)
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvoice = async () => {
    if (!confirm('Send this invoice to the client?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}/send`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Show success message
        const successDiv = document.createElement('div')
        successDiv.innerHTML = `
          <div class="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            📧 Invoice sent successfully!
          </div>
        `
        document.body.appendChild(successDiv)
        
        setTimeout(() => {
          document.body.removeChild(successDiv)
          window.location.reload()
        }, 2000)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to send invoice'}`)
      }
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    setLoading(true)
    try {
      // Create a simple PDF download simulation
      const response = await fetch(`/api/admin/invoices/${invoice.id}/download`, {
        method: 'GET'
      })
      
      if (response.ok) {
        // For now, create a simple invoice text download
        const invoiceText = `INVOICE ${invoice.invoice_number}
        
Total Amount: $${invoice.total_amount.toLocaleString()}
Status: ${invoice.status.toUpperCase()}
Date: ${new Date().toLocaleDateString()}

This is a simplified invoice download. 
Full PDF generation will be implemented soon.`

        const blob = new Blob([invoiceText], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Invoice-${invoice.invoice_number}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        // Show success message
        const successDiv = document.createElement('div')
        successDiv.innerHTML = `
          <div class="fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            📄 Invoice downloaded! (PDF generation coming soon)
          </div>
        `
        document.body.appendChild(successDiv)
        
        setTimeout(() => {
          document.body.removeChild(successDiv)
        }, 3000)
      } else {
        alert('Download failed. Please try again.')
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
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