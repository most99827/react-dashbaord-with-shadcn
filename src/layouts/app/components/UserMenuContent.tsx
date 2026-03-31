import { LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { useAuth } from "@/auth/useAuth"
import { UserInfo, type AppUser } from "./UserInfo"
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function UserMenuContent({ user }: { user: AppUser }) {
  const { logout } = useAuth()

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
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => void handleLogout()} className="cursor-pointer">
        <LogOut className="mr-2" />
        Log out
      </DropdownMenuItem>
    </>
  )
}
