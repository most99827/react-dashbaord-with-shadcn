import { LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { useAuth } from "@/auth/useAuth"
import { UserInfo, type AppUser } from "./UserInfo"
import { useTranslations } from "@/i18n"
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function UserMenuContent({ user }: { user: AppUser }) {
  const { logout } = useAuth()
  const common = useTranslations("common")

  async function handleLogout() {
    await logout()
    window.location.assign("/login")
  }

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link to="/settings/profile" className="block w-full cursor-pointer">
            <Settings className="mr-2" />
            {common("nav.settings")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => void handleLogout()} className="cursor-pointer">
        <LogOut className="mr-2" />
        {common("nav.logout")}
      </DropdownMenuItem>
    </>
  )
}
