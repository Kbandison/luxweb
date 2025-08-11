import { requireClientAuth } from '@/lib/portal-auth'
import { generateClientTheme } from '@/lib/theme-generator'
import { PortalLayoutClient } from '@/components/portal/PortalLayoutClient'

interface PortalLayoutProps {
  children: React.ReactNode
}

export default async function PortalLayout({ children }: PortalLayoutProps) {
  const user = await requireClientAuth()
  const theme = generateClientTheme(user.client?.brand_colors || {})

  return (
    <PortalLayoutClient user={user} theme={theme}>
      {children}
    </PortalLayoutClient>
  )
}