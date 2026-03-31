import { ChevronsUpDown } from "lucide-react"

import { useAuth } from "@/auth/useAuth"
import { UserInfo, type AppUser } from "./UserInfo"
import { UserMenuContent } from "./UserMenuContent"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

function toAppUser(user: any): AppUser {
  return {
    name: String(user?.name ?? user?.full_name ?? user?.username ?? user?.email ?? "Admin"),
    email: user?.email ? String(user.email) : undefined,
    avatar: user?.avatar ? String(user.avatar) : undefined,
  }
}

export function NavUser() {
  const { user } = useAuth()
  const { state } = useSidebar()
  const isMobile = useIsMobile()

  const appUser = toAppUser(user)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent" data-test="sidebar-menu-button">
              <UserInfo user={appUser} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            side={isMobile ? "bottom" : state === "collapsed" ? "left" : "bottom"}
          >
            <UserMenuContent user={appUser} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

