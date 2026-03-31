import { type ReactNode } from "react"
import { useLocale } from "@/i18n"
import { SidebarProvider } from "@/components/ui/sidebar"

interface AppShellProps {
  children: ReactNode
  variant?: "header" | "sidebar"
}

export function AppShell({ children, variant = "header" }: AppShellProps) {
  const { dir } = useLocale()

  if (variant === "header") {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>
  }

  return <SidebarProvider defaultOpen={true} side={dir === "rtl" ? "right" : "left"}>{children}</SidebarProvider>
}
