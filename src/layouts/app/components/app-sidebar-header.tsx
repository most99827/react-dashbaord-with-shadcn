import { Bell, HelpCircle, Search } from "lucide-react"

import { Breadcrumbs, type BreadcrumbItemType } from "./Breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppSidebarHeader({
  breadcrumbs = [],
}: {
  breadcrumbs?: BreadcrumbItemType[]
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-3 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 dark:border-slate-800 dark:bg-slate-950/85 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <div className="hidden md:block">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="relative ms-1 hidden w-full max-w-md lg:block">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-9 rounded-lg ps-8" placeholder="Search workspace..." />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" className="size-8">
          <Bell className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8">
          <HelpCircle className="size-4" />
        </Button>
      </div>
    </header>
  )
}
