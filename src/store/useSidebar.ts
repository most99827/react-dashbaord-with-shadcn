import { useEffect, useState } from "react"

const STORAGE_KEY = "sidebar_state"

function getStoredValue() {
  if (typeof window === "undefined") return true

  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === null ? true : value === "true"
}

export function useSidebar() {
  const [isExpanded, setIsExpanded] = useState(getStoredValue)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(isExpanded))
  }, [isExpanded])

  return {
    isExpanded,
    isCollapsed: !isExpanded,
    setIsExpanded,
    toggleSidebar: () => setIsExpanded((current) => !current),
  }
}
