import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

type ThemeToggleProps = {
  theme: "light" | "dark"
  label: string
  onToggle: () => void
}

export default function ThemeToggle({
  theme,
  label,
  onToggle,
}: ThemeToggleProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      aria-label={label}
      className="rounded-full border-white/60 bg-white/70 backdrop-blur-sm transition-transform hover:scale-[1.03] dark:border-white/10 dark:bg-white/5"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}
