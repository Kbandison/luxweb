import { getAdminUser } from '@/lib/auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminContent } from '@/components/admin/AdminContent'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAdminUser()

  return (
    <div className="min-h-screen bg-black">
      {user && (
        <>
          {/* Admin Header - sits under main navigation, only shows if authenticated */}
          <AdminHeader user={user} />
          
          {/* Admin Sidebar - sits under admin header, only shows if authenticated */}
          <AdminSidebar user={user} />
        </>
      )}
      
      {/* Main Content - responsive to authentication state */}
      <AdminContent user={user}>
        {children}
      </AdminContent>
    </div>
  )
}