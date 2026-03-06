import { getAdminUser } from '@/lib/auth'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAdminUser()

  if (!user) {
    // Not authenticated — render children directly (login page)
    return (
      <div className="min-h-screen bg-black">
        {children}
      </div>
    )
  }

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  )
}
