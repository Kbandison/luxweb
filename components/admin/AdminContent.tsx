import { Breadcrumbs } from './Breadcrumbs'

interface AdminContentProps {
  children: React.ReactNode
  user: any
}

export function AdminContent({ children, user }: AdminContentProps) {
  // If authenticated: account for admin header + sidebar
  // If not authenticated: only account for main nav
  const contentClasses = user 
    ? "pt-[136px] pl-64 min-h-screen" // Main nav (80px) + Admin header (56px) + Sidebar (256px)
    : "pt-[80px] min-h-screen"        // Only main nav (80px)

  return (
    <main className={contentClasses}>
      {user && (
        <div className="p-6 pb-0">
          <Breadcrumbs />
        </div>
      )}
      <div className={user ? "px-6" : ""}>
        {children}
      </div>
    </main>
  )
}