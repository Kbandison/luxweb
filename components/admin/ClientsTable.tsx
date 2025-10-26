'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Mail, 
  Phone, 
  ExternalLink, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

interface Client {
  id: string
  primary_contact: string
  email: string
  phone?: string
  company_name?: string
  status: 'active' | 'inactive' | 'archived'
  created_at: string
  projects?: Array<{
    id: string
    project_name: string
    status: string
    total_value?: number
  }>
  contact_submissions?: {
    project_type: string
    budget_range: string
  }
}

interface ClientsTableProps {
  clients: Client[]
}

const statusColors = {
  active: 'bg-green-500/20 text-green-300 border-green-500/30',
  inactive: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  archived: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.primary_contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedClients = filteredClients.slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handleEditClient = (client: Client) => {
    // Navigate to edit client page
    window.location.href = `/admin/clients/${client.id}/edit`
  }

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/clients/${clientId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Reload page to reflect changes
          window.location.reload()
        } else {
          alert('Failed to delete client. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting client:', error)
        alert('An error occurred while deleting the client.')
      }
    }
  }

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Client</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Contact</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Projects</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Joined</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  No clients found
                </td>
              </tr>
            ) : (
              paginatedClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {/* Client Info */}
                  <td className="py-5 px-6">
                    <div>
                      <div className="font-medium text-white">{client.primary_contact}</div>
                      {client.company_name && (
                        <div className="text-sm text-gray-400">{client.company_name}</div>
                      )}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="h-3 w-3" />
                        <a 
                          href={`mailto:${client.email}`}
                          className="hover:text-primary-light transition-colors"
                        >
                          {client.email}
                        </a>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="h-3 w-3" />
                          <a 
                            href={`tel:${client.phone}`}
                            className="hover:text-primary-light transition-colors"
                          >
                            {client.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Projects */}
                  <td className="py-5 px-6">
                    <div className="text-sm">
                      <div className="text-white font-medium">
                        {client.projects?.length || 0} projects
                      </div>
                      {client.projects && client.projects.length > 0 && (
                        <div className="text-gray-400 text-xs mt-1">
                          Active: {client.projects.filter(p => 
                            ['planning', 'in_progress', 'review'].includes(p.status)
                          ).length}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-5 px-6">
                    <Badge className={`${statusColors[client.status]} border`}>
                      {client.status}
                    </Badge>
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4 text-sm text-gray-400">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/clients/${client.id}`}>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditClient(client)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {filteredClients.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <div>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredClients.length)} of {filteredClients.length} clients
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="text-gray-400 hover:text-white disabled:text-gray-600"
            >
              Previous
            </Button>
            <span className="text-white px-2">
              {currentPage} of {totalPages}
            </span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="text-gray-400 hover:text-white disabled:text-gray-600"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}