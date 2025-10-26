import { SettingsForm } from '@/components/admin/SettingsForm'
import { 
  Settings, 
  Mail, 
  CreditCard, 
  Shield, 
  Bell,
  Database,
  Palette
} from 'lucide-react'

export default function SettingsPage() {
  const settingSections = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic business information and preferences',
      icon: Settings,
      color: 'blue'
    },
    {
      id: 'email',
      title: 'Email Configuration',
      description: 'Email server settings and templates',
      icon: Mail,
      color: 'green'
    },
    {
      id: 'payments',
      title: 'Payment Settings',
      description: 'Payment gateways and billing configuration',
      icon: CreditCard,
      color: 'purple'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences and alerts',
      icon: Bell,
      color: 'orange'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Authentication and access control settings',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'branding',
      title: 'Branding',
      description: 'Logo, colors, and client portal customization',
      icon: Palette,
      color: 'pink'
    },
    {
      id: 'backup',
      title: 'Backup & Data',
      description: 'Data export and backup configuration',
      icon: Database,
      color: 'gray'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-600/20 text-blue-400',
      green: 'bg-green-600/20 text-green-400',
      purple: 'bg-purple-600/20 text-purple-400',
      orange: 'bg-orange-600/20 text-orange-400',
      red: 'bg-red-600/20 text-red-400',
      pink: 'bg-pink-600/20 text-pink-400',
      gray: 'bg-gray-600/20 text-gray-400'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your business settings, preferences, and configurations</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingSections.map((section) => (
          <div
            key={section.id}
            className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(section.color)} group-hover:scale-110 transition-transform`}>
                <section.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-light transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsForm />
        
        {/* System Status */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database Connection</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email Service</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">File Storage</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm">Operational</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Backups</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-400 text-sm">Manual</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>v1.0.0</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Last Updated:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}