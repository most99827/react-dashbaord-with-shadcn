export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized"

export const AUTH_ROUTES_TO_SKIP = [
  "/auth/login",
  "/auth/logout",
  "/auth/refresh",
] as const

export function isSkippedAuthRoute(url?: string): boolean {
  if (!url) return false
  return AUTH_ROUTES_TO_SKIP.some((route) => url.includes(route))
}

export function isLoginPath(pathname?: string): boolean {
  const currentPath = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "")
  return currentPath === "/login"
}

export function dispatchUnauthorized(reason = "unauthorized"): void {
  if (typeof window === "undefined") return

  window.dispatchEvent(
    new CustomEvent(AUTH_UNAUTHORIZED_EVENT, {
      detail: {
        reason,
        at: Date.now(),
      },
    }),
  )
}
