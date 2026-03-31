export function getPreferredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"

  const stored = window.localStorage.getItem("theme")
  if (stored === "light" || stored === "dark") return stored

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function persistTheme(theme: "light" | "dark") {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("theme", theme)
  }

  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }
}
