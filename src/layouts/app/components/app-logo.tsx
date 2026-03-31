import AppLogoIcon from "./app-logo-icon"
import { cn } from "@/lib/utils"

export default function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact && "justify-center") }>
      <div className="flex size-10 items-center justify-center rounded-lg bg-white text-[#0b1f3f] shadow-sm">
        <AppLogoIcon className="size-5 fill-current" />
      </div>
      {!compact ? (
        <div className="grid flex-1 text-left">
          <span className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">Autostrad</span>
          <span className="truncate text-xs tracking-tight text-slate-500 dark:text-slate-400">Administration</span>
        </div>
      ) : null}
    </div>
  )
}
