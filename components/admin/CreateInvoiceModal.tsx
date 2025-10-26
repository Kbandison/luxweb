'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Plus, Trash2 } from 'lucide-react'

interface Client {
  id: string
  primary_contact: string
  company_name: string | null
  email: string
}

interface Project {
  id: string
  project_name: string
  client_id: string
  total_value: number | null
}

interface CreateInvoiceModalProps {
  clients: Client[]
  projects: Project[]
  children: React.ReactNode
}

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export function CreateInvoiceModal({ clients, projects, children }: CreateInvoiceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    client_id: '',
    project_id: '',
    status: 'draft' as const,
    invoice_type: 'standard' as const,
    amount: '',
    tax_rate: '8.5', // Default tax rate
    due_date: '',
    description: ''
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Calculate totals
      const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
      const taxRate = parseFloat(formData.tax_rate) / 100
      const taxAmount = subtotal * taxRate
      const totalAmount = subtotal + taxAmount

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`

      const invoiceData = {
        invoice_number: invoiceNumber,
        client_id: formData.client_id,
        project_id: formData.project_id || null,
        status: formData.status,
        invoice_type: formData.invoice_type,
        amount: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        due_date: formData.due_date || null,
        description: formData.description || null,
        line_items: lineItems
      }

      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create invoice')
      }

      const result = await response.json()
      
      // Reset form and close modal
      setFormData({
        client_id: '',
        project_id: '',
        status: 'draft',
        invoice_type: 'standard',
        amount: '',
        tax_rate: '8.5',
        due_date: '',
        description: ''
      })
      setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }])
      setError(null)
      setOpen(false)
      
      // Refresh the page to show new invoice
      router.refresh()
      
    } catch (error) {
      console.error('Error creating invoice:', error)
      setError(error instanceof Error ? error.message : 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => {
      const newItems = [...prev]
      newItems[index] = { ...newItems[index], [field]: value }
      
      // Recalculate amount for this line item
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate
      }
      
      return newItems
    })
  }

  const addLineItem = () => {
    setLineItems(prev => [...prev, { description: '', quantity: 1, rate: 0, amount: 0 }])
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter((_, i) => i !== index))
    }
  }

  // Auto-fill project value when project is selected
  const handleProjectChange = (projectId: string) => {
    setFormData(prev => ({ ...prev, project_id: projectId }))
    
    const selectedProject = projects.find(p => p.id === projectId)
    if (selectedProject && selectedProject.total_value) {
      // Update first line item with project value
      setLineItems(prev => {
        const newItems = [...prev]
        newItems[0] = {
          description: `${selectedProject.project_name} - Full Project`,
          quantity: 1,
          rate: selectedProject.total_value || 0,
          amount: selectedProject.total_value || 0
        }
        return newItems
      })
    }
  }

  // Filter projects by selected client
  const filteredProjects = formData.client_id 
    ? projects.filter(p => p.client_id === formData.client_id)
    : projects

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = subtotal * (parseFloat(formData.tax_rate) / 100)
  const total = subtotal + taxAmount

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto bg-black border border-white/20">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-white">Create New Invoice</DialogTitle>
        </DialogHeader>
        
        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Invoice Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="client_id" className="text-white text-sm font-medium mb-2 block">Client *</Label>
                <Select value={formData.client_id} onValueChange={(value) => handleInputChange('client_id', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12">
                    <SelectValue placeholder="Select client" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                        {client.primary_contact}
                        {client.company_name && ` (${client.company_name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project_id" className="text-white text-sm font-medium mb-2 block">Project (Optional)</Label>
                <Select value={formData.project_id} onValueChange={handleProjectChange}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12">
                    <SelectValue placeholder="Select project" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {filteredProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                        {project.project_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Label htmlFor="invoice_type" className="text-white text-sm font-medium mb-2 block">Invoice Type</Label>
                <Select value={formData.invoice_type} onValueChange={(value: any) => handleInputChange('invoice_type', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12">
                    <SelectValue className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="standard" className="text-white hover:bg-white/10 focus:bg-white/10">Standard Invoice</SelectItem>
                    <SelectItem value="down_payment" className="text-white hover:bg-white/10 focus:bg-white/10">Down Payment</SelectItem>
                    <SelectItem value="progress_payment" className="text-white hover:bg-white/10 focus:bg-white/10">Progress Payment</SelectItem>
                    <SelectItem value="final_payment" className="text-white hover:bg-white/10 focus:bg-white/10">Final Payment</SelectItem>
                    <SelectItem value="retainer" className="text-white hover:bg-white/10 focus:bg-white/10">Monthly Retainer</SelectItem>
                    <SelectItem value="expense_reimbursement" className="text-white hover:bg-white/10 focus:bg-white/10">Expense Reimbursement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-white text-sm font-medium mb-2 block">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12">
                    <SelectValue className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="draft" className="text-white hover:bg-white/10 focus:bg-white/10">Draft</SelectItem>
                    <SelectItem value="sent" className="text-white hover:bg-white/10 focus:bg-white/10">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="due_date" className="text-white text-sm font-medium mb-2 block">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12"
                />
              </div>

              <div>
                <Label htmlFor="tax_rate" className="text-white text-sm font-medium mb-2 block">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.1"
                  value={formData.tax_rate}
                  onChange={(e) => handleInputChange('tax_rate', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12"
                  placeholder="8.5"
                />
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Line Items</h3>
              <Button type="button" onClick={addLineItem} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 bg-white/5 rounded-lg">
                  <div className="col-span-5">
                    <Label className="text-white text-sm font-medium mb-2 block">Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light focus:ring-1 focus:ring-primary-light"
                      placeholder="Service description"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-white text-sm font-medium mb-2 block">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-white text-sm font-medium mb-2 block">Rate ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-white text-sm font-medium mb-2 block">Amount</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      variant="ghost"
                      size="sm"
                      disabled={lineItems.length === 1}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax ({formData.tax_rate}%):</span>
                  <span>${taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-white border-t border-white/10 pt-2">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Additional Notes</h3>
            
            <div>
              <Label htmlFor="description" className="text-white text-sm font-medium mb-2 block">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light focus:ring-1 focus:ring-primary-light min-h-[100px]"
                placeholder="Additional notes or terms for this invoice"
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setError(null)
              }}
              disabled={loading}
              className="border-white/20 text-white hover:bg-white/10 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.client_id || lineItems.length === 0}
              className="bg-primary-light hover:bg-primary-light/80 text-white px-8"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}