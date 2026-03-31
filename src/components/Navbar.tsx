import { Bell, CircleHelp, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react"
import { useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { menu } from "@/config/menu"

type NavbarProps = {
  isExpanded: boolean
  onToggleSidebar: () => void
}

function getCurrentTitle(pathname: string) {
  if (pathname === "/home") return "Dashboard"

  for (const item of menu) {
    if (item.path === pathname) return item.title
    const child = item.children?.find((entry) => entry.path === pathname)
    if (child) return child.title
  }

  return "Dashboard"
}

export default function Navbar({ isExpanded, onToggleSidebar }: NavbarProps) {
  const location = useLocation()
  const title = getCurrentTitle(location.pathname)

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Button type="button" variant="ghost" size="icon" onClick={onToggleSidebar} className="h-7 w-7 rounded-md">
          {isExpanded ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </Button>

        <div className="min-w-0 shrink-0 text-[16px] font-medium text-slate-950 dark:text-white">{title}</div>

        <div className="relative hidden w-full max-w-[660px] lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search repositories, branches, pull requests..." className="h-12 rounded-2xl pl-12 text-[15px] shadow-sm" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" className="size-9 rounded-xl">
          <Bell className="size-5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-9 rounded-xl">
          <CircleHelp className="size-5" />
        </Button>
      </div>
    </header>
  )
}
