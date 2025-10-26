'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save, Building, Mail, Phone, MapPin } from 'lucide-react'

export function SettingsForm() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    business_name: 'LuxWeb Studio',
    business_email: 'support@luxwebstudio.dev',
    business_phone: '(718) 635-0736',
    business_address: '',
    website_url: 'https://luxwebstudio.dev',
    tax_rate: '8.5',
    currency: 'USD',
    timezone: 'America/New_York',
    auto_backup: true,
    email_notifications: true,
    client_notifications: true,
    invoice_due_days: '30',
    late_fee_percentage: '5',
    terms_of_service: 'Payment is due within 30 days of invoice date. Late fees may apply.',
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      const successDiv = document.createElement('div')
      successDiv.innerHTML = `
        <div class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✅ Settings saved successfully!
        </div>
      `
      document.body.appendChild(successDiv)
      
      setTimeout(() => {
        document.body.removeChild(successDiv)
      }, 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Business Settings</h2>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-primary-light hover:bg-primary-medium"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Business Name</Label>
              <Input
                value={settings.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Website URL</Label>
              <Input
                value={settings.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Business Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={settings.business_email}
                  onChange={(e) => handleInputChange('business_email', e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Business Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={settings.business_phone}
                  onChange={(e) => handleInputChange('business_phone', e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-white text-sm font-medium mb-2 block">Business Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                value={settings.business_address}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="123 Main St, City, State, ZIP"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-lg font-medium text-white">Financial Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Default Tax Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={settings.tax_rate}
                onChange={(e) => handleInputChange('tax_rate', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Currency</Label>
              <select
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary-light focus:outline-none"
              >
                <option value="USD" className="bg-gray-900">USD ($)</option>
                <option value="EUR" className="bg-gray-900">EUR (€)</option>
                <option value="GBP" className="bg-gray-900">GBP (£)</option>
              </select>
            </div>
            
            <div>
              <Label className="text-white text-sm font-medium mb-2 block">Invoice Due Days</Label>
              <Input
                type="number"
                value={settings.invoice_due_days}
                onChange={(e) => handleInputChange('invoice_due_days', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-lg font-medium text-white">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-400">Receive email alerts for important events</p>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Client Notifications</Label>
                <p className="text-sm text-gray-400">Send automatic notifications to clients</p>
              </div>
              <Switch
                checked={settings.client_notifications}
                onCheckedChange={(checked) => handleInputChange('client_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Auto Backup</Label>
                <p className="text-sm text-gray-400">Automatically backup data weekly</p>
              </div>
              <Switch
                checked={settings.auto_backup}
                onCheckedChange={(checked) => handleInputChange('auto_backup', checked)}
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-lg font-medium text-white">Terms & Conditions</h3>
          
          <div>
            <Label className="text-white text-sm font-medium mb-2 block">Default Terms of Service</Label>
            <Textarea
              value={settings.terms_of_service}
              onChange={(e) => handleInputChange('terms_of_service', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              rows={4}
              placeholder="Enter your default terms of service..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}