import type { ReactNode } from "react"

import { AppContent } from "./app-content.tsx"
import { AppShell } from "./app-shell.tsx"
import { AppSidebar } from "./app-sidebar.tsx"
import { AppSidebarHeader } from "./components/app-sidebar-header.tsx"
import type { BreadcrumbItemType } from "./components/Breadcrumbs"

interface AppSidebarLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItemType[];
}

export default function AppSidebarLayout({ 
  children, 
  breadcrumbs = [],
  ...props 
}: AppSidebarLayoutProps) {
  return (
    <AppShell variant="sidebar" {...props}>
      <AppSidebar />
      <AppContent variant="sidebar" className="overflow-x-hidden">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </AppContent>
    </AppShell>
  )
}
