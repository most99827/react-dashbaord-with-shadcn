import type { ReactNode } from "react"
import { useLayoutPreference } from "@/layouts/LayoutProvider"
import AppSidebarLayoutTemplate from "./app/app-sidebar-layout.tsx"
import AppHeaderLayoutTemplate from "./app/app-header-layout.tsx"
import type { BreadcrumbItemType } from "./app/components/Breadcrumbs"

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItemType[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { layout } = useLayoutPreference()

  if (layout === "header") {
    return (
      <AppHeaderLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
      </AppHeaderLayoutTemplate>
    )
  }

  return (
    <AppSidebarLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
    </AppSidebarLayoutTemplate>
  )
}
