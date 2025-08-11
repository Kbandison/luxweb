'use client'

import { Receipt, FileText } from 'lucide-react'

interface InvoiceDetailsProps {
  invoice: any
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const lineItems = invoice.line_items || []

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
        <Receipt className="w-5 h-5" />
        <span>Invoice Details</span>
      </h2>
      
      {/* Billing Information */}
      <div className="mb-8">
        <h3 className="text-white font-medium mb-4">Bill To</h3>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white font-medium">{invoice.client?.company_name || 'Company Name'}</p>
          <p className="text-gray-400">{invoice.client?.primary_contact}</p>
          <p className="text-gray-400">{invoice.client?.email}</p>
          {invoice.client?.address && (
            <p className="text-gray-400 mt-2">{invoice.client.address}</p>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <h3 className="text-white font-medium mb-4">Items & Services</h3>
        
        {lineItems.length === 0 ? (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
            <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No line items available</p>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Description</th>
                    <th className="text-right px-4 py-3 text-gray-400 font-medium">Qty</th>
                    <th className="text-right px-4 py-3 text-gray-400 font-medium">Rate</th>
                    <th className="text-right px-4 py-3 text-gray-400 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-white/5 last:border-b-0">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{item.description}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        ${item.rate?.toLocaleString() || '0.00'}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-medium">
                        ${item.amount?.toLocaleString() || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Subtotal:</span>
            <span className="text-white font-medium">
              ${invoice.amount?.toLocaleString() || '0.00'}
            </span>
          </div>
          
          {invoice.tax_amount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tax:</span>
              <span className="text-white font-medium">
                ${invoice.tax_amount?.toLocaleString() || '0.00'}
              </span>
            </div>
          )}
          
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-lg">Total:</span>
              <span className="text-white font-bold text-xl">
                ${invoice.total_amount?.toLocaleString() || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {invoice.description && (
        <div className="mt-8">
          <h3 className="text-white font-medium mb-4">Notes</h3>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-gray-300 leading-relaxed">{invoice.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}