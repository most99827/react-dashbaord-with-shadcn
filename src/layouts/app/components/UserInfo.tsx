import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInitials } from "@/hooks/use-initials"

export type AppUser = {
  name?: string
  username?: string
  email?: string
  avatar?: string
  photo?: string
}

export function UserInfo({ user, showEmail = false }: { user: AppUser; showEmail?: boolean }) {
  const getInitials = useInitials()
  
  const displayName = user.name || user.username || "User"
  const displayAvatar = user.avatar || user.photo || ""

  return (
    <>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full">
        <AvatarImage src={displayAvatar} alt={displayName} />
        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{displayName}</span>
        {showEmail && user.email ? <span className="truncate text-xs text-muted-foreground">{user.email}</span> : null}
      </div>
    </>
  )
}
