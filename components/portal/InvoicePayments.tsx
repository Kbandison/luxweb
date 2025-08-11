'use client'

import { CreditCard, Calendar, CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface InvoicePaymentsProps {
  invoice: any
  payments: any[]
}

export function InvoicePayments({ invoice, payments }: InvoicePaymentsProps) {
  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0)
  
  const remainingBalance = (invoice.total_amount || 0) - totalPaid
  const isFullyPaid = remainingBalance <= 0

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Payment Summary</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Invoice Total:</span>
            <span className="text-white font-semibold">
              ${invoice.total_amount?.toLocaleString() || '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Amount Paid:</span>
            <span className="text-green-400 font-semibold">
              ${totalPaid.toLocaleString()}
            </span>
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Balance Due:</span>
              <span className={`font-bold text-lg ${isFullyPaid ? 'text-green-400' : 'text-white'}`}>
                ${remainingBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            {isFullyPaid ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Paid in Full</span>
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-medium">Payment Pending</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment History</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-6">
            <CreditCard className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No payments recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    payment.status === 'completed' 
                      ? 'bg-green-500/10' 
                      : payment.status === 'pending'
                      ? 'bg-amber-500/10'
                      : 'bg-red-500/10'
                  }`}>
                    {payment.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      ${payment.amount?.toLocaleString() || '0.00'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {payment.payment_method || 'Credit Card'} • {' '}
                      {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    payment.status === 'completed'
                      ? 'bg-green-500/10 text-green-400'
                      : payment.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {payment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              Due Date: {' '}
              <span className="text-white">
                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Not specified'}
              </span>
            </span>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
            <p className="text-blue-400 text-xs font-medium mb-1">Payment Methods Accepted</p>
            <p className="text-gray-300 text-xs">
              Credit Card, Bank Transfer, Check
            </p>
          </div>
          
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
            <p className="text-gray-400 text-xs font-medium mb-1">Questions?</p>
            <p className="text-gray-300 text-xs">
              Contact us at support@luxwebstudio.dev
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}