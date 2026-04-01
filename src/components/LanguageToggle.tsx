import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLocale, useTranslations } from "@/i18n"

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLocale()
  const common = useTranslations("common")
  const nextLanguageLabel = locale === "en" ? common("arabic") : common("english")

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleLocale}
      className="gap-2 rounded-full border-white/60 bg-white/70 px-3 backdrop-blur-sm transition-transform hover:scale-[1.03] dark:border-white/10 dark:bg-white/5"
      aria-label={common("languageLabel")}
      title={common("languageLabel")}
    >
      <Languages className="size-4" />
      <span>{nextLanguageLabel}</span>
    </Button>
  )
}
