import { Columns2, PanelTop } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CommonMessages } from "@/i18n"
import { useLayoutPreference } from "@/layouts/LayoutProvider"

export default function LayoutToggle({ copy }: { copy: CommonMessages }) {
  const { layout, toggleLayout } = useLayoutPreference()
  const isSidebar = layout === "sidebar"

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleLayout}
      className="gap-2 rounded-full border-white/60 bg-white/70 px-3 backdrop-blur-sm transition-transform hover:scale-[1.03] dark:border-white/10 dark:bg-white/5"
      aria-label={copy.layoutLabel}
      title={copy.layoutLabel}
    >
      {isSidebar ? <PanelTop className="size-4" /> : <Columns2 className="size-4" />}
      <span>{isSidebar ? copy.topbarLayout : copy.sidebarLayout}</span>
    </Button>
  )
}
