import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CommonMessages, Locale } from "@/i18n"

type LanguageToggleProps = {
  locale: Locale
  copy: CommonMessages
  onToggle: () => void
}

export default function LanguageToggle({
  locale,
  copy,
  onToggle,
}: LanguageToggleProps) {
  const nextLanguageLabel = locale === "en" ? copy.arabic : copy.english

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggle}
      className="gap-2 rounded-full border-white/60 bg-white/70 px-3 backdrop-blur-sm transition-transform hover:scale-[1.03] dark:border-white/10 dark:bg-white/5"
      aria-label={copy.languageLabel}
      title={copy.languageLabel}
    >
      <Languages className="size-4" />
      <span>{nextLanguageLabel}</span>
    </Button>
  )
}
