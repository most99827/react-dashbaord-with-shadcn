import type { ReactNode } from "react"
import { AppContent } from "./app-content.tsx"
import { AppHeader } from "./app-header.tsx"
import { AppShell } from "./app-shell.tsx"
import type { BreadcrumbItemType } from "./components/Breadcrumbs"

interface AppHeaderLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItemType[];
}

export default function AppHeaderLayout({ 
    children, 
    breadcrumbs = [],
    ...props 
}: AppHeaderLayoutProps) {
  return (
    <AppShell variant="header" {...props}>
        <AppHeader breadcrumbs={breadcrumbs} />
        <AppContent variant="header">
            {children}
        </AppContent>
    </AppShell>
  )
}
