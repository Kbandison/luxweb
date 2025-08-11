import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Edit,
  Palette
} from 'lucide-react'
import { Client } from '@/lib/supabase'

interface ClientDetailsProps {
  client: Client & {
    projects?: any[]
    client_communications?: any[]
  }
}

const statusColors = {
  active: 'bg-green-500/20 text-green-300 border-green-500/30',
  inactive: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  archived: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

export function ClientDetails({ client }: ClientDetailsProps) {
  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Client Details</h3>
        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
          <Badge className={`${statusColors[client.status]} border`}>
            {client.status}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <Mail className="h-4 w-4 text-gray-400" />
            <a 
              href={`mailto:${client.email}`}
              className="hover:text-primary-light transition-colors"
            >
              {client.email}
            </a>
          </div>

          {client.phone && (
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="h-4 w-4 text-gray-400" />
              <a 
                href={`tel:${client.phone}`}
                className="hover:text-primary-light transition-colors"
              >
                {client.phone}
              </a>
            </div>
          )}

          {client.address && (
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{client.address}</span>
            </div>
          )}

          {client.website_url && (
            <div className="flex items-center gap-3 text-gray-300">
              <Globe className="h-4 w-4 text-gray-400" />
              <a 
                href={client.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary-light transition-colors"
              >
                {client.website_url}
              </a>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Joined {new Date(client.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Brand Colors */}
        {client.brand_colors && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Brand Colors
            </label>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-gray-400" />
              <div className="flex gap-2">
                {Object.entries(client.brand_colors).map(([key, color]) => (
                  <div
                    key={key}
                    className="w-6 h-6 rounded border border-white/20"
                    style={{ backgroundColor: color as string }}
                    title={`${key}: ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes
            </label>
            <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-lg p-3">
              {client.notes}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {client.projects?.length || 0}
              </div>
              <div className="text-xs text-gray-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {client.client_communications?.length || 0}
              </div>
              <div className="text-xs text-gray-400">Communications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}