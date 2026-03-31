import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type LayoutMode = "sidebar" | "header"

type LayoutContextValue = {
  layout: LayoutMode
  setLayout: (layout: LayoutMode) => void
  toggleLayout: () => void
}

const STORAGE_KEY = "app-layout-mode"

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined)

function normalizeLayout(value: string | null | undefined): LayoutMode {
  return value === "header" ? "header" : "sidebar"
}

export function getStoredLayout(): LayoutMode {
  if (typeof window === "undefined") return "sidebar"

  return normalizeLayout(window.localStorage.getItem(STORAGE_KEY))
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutMode>(() => getStoredLayout())

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, layout)
    }
  }, [layout])

  const value = useMemo(
    () => ({
      layout,
      setLayout: (nextLayout: LayoutMode) => setLayoutState(normalizeLayout(nextLayout)),
      toggleLayout: () => setLayoutState((current) => (current === "sidebar" ? "header" : "sidebar")),
    }),
    [layout],
  )

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayoutPreference() {
  const context = useContext(LayoutContext)

  if (!context) {
    throw new Error("useLayoutPreference must be used within a LayoutProvider")
  }

  return context
}
