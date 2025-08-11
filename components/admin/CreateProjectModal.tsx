'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

interface Client {
  id: string
  primary_contact: string
  company_name: string | null
  email: string
}

interface Package {
  id: string
  name: string
  price: number
  description: string | null
}

interface CreateProjectModalProps {
  clients: Client[]
  packages: Package[]
  children: React.ReactNode
}

export function CreateProjectModal({ clients, packages, children }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    package_id: '',
    status: 'planning' as const,
    start_date: '',
    deadline: '',
    total_value: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const projectData = {
        ...formData,
        total_value: formData.total_value ? parseFloat(formData.total_value) : null,
        start_date: formData.start_date || null,
        deadline: formData.deadline || null,
      }

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      const result = await response.json()
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        client_id: '',
        package_id: '',
        status: 'planning',
        start_date: '',
        deadline: '',
        total_value: ''
      })
      setError(null)
      setOpen(false)
      
      // Refresh the page to show new project
      router.refresh()
      
    } catch (error) {
      console.error('Error creating project:', error)
      setError(error instanceof Error ? error.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Auto-fill total value when package is selected
  const handlePackageChange = (packageId: string) => {
    setFormData(prev => ({ ...prev, package_id: packageId }))
    
    const selectedPackage = packages.find(pkg => pkg.id === packageId)
    if (selectedPackage) {
      setFormData(prev => ({ 
        ...prev, 
        total_value: selectedPackage.price.toString()
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto bg-black border border-white/20">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-white">Create New Project</DialogTitle>
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
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Basic Information</h3>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-white text-sm font-medium mb-2 block">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12"
                  placeholder="Website Development for ABC Company"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white text-sm font-medium mb-2 block">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light focus:ring-1 focus:ring-primary-light min-h-[100px]"
                  placeholder="Brief description of the project scope and goals"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Client and Package Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Client & Package</h3>
            
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
                <Label htmlFor="package_id" className="text-white text-sm font-medium mb-2 block">Package</Label>
                <Select value={formData.package_id} onValueChange={handlePackageChange}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12">
                    <SelectValue placeholder="Select package" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                        {pkg.name} - ${pkg.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Project Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="status" className="text-white text-sm font-medium mb-2 block">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12">
                    <SelectValue className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="planning" className="text-white hover:bg-white/10 focus:bg-white/10">Planning</SelectItem>
                    <SelectItem value="in_progress" className="text-white hover:bg-white/10 focus:bg-white/10">In Progress</SelectItem>
                    <SelectItem value="review" className="text-white hover:bg-white/10 focus:bg-white/10">Review</SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-white/10 focus:bg-white/10">Completed</SelectItem>
                    <SelectItem value="on_hold" className="text-white hover:bg-white/10 focus:bg-white/10">On Hold</SelectItem>
                    <SelectItem value="cancelled" className="text-white hover:bg-white/10 focus:bg-white/10">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="start_date" className="text-white text-sm font-medium mb-2 block">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12"
                />
              </div>

              <div>
                <Label htmlFor="deadline" className="text-white text-sm font-medium mb-2 block">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12"
                />
              </div>
            </div>
          </div>

          {/* Financial Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Financial</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="total_value" className="text-white text-sm font-medium mb-2 block">Total Value ($)</Label>
                <Input
                  id="total_value"
                  type="number"
                  step="0.01"
                  value={formData.total_value}
                  onChange={(e) => handleInputChange('total_value', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary-light focus:ring-1 focus:ring-primary-light h-12"
                  placeholder="5000.00"
                />
              </div>
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
              disabled={loading || !formData.title || !formData.client_id}
              className="bg-primary-light hover:bg-primary-light/80 text-white px-8"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}