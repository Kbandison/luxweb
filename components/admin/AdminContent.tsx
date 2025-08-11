interface AdminContentProps {
  children: React.ReactNode
  user: any
}

export function AdminContent({ children, user }: AdminContentProps) {
  // If authenticated: account for admin header + sidebar
  // If not authenticated: only account for main nav
  const contentClasses = user 
    ? "pt-[136px] pl-64" // Main nav (80px) + Admin header (56px) + Sidebar (256px)
    : "pt-[80px]"        // Only main nav (80px)

  return (
    <main className={contentClasses}>
      {children}
    </main>
  )
}