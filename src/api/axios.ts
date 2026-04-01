import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

import { getStoredLocale } from "@/i18n"

NProgress.configure({ showSpinner: false })

// ─── Axios Instance ────────────────────────────────────────────────────────────

/**
 * Single shared Axios instance for the entire app.
 *
 * Design decisions:
 *  - withCredentials: true  → browser sends HttpOnly JWT + refresh cookies
 *  - NO Authorization header → backend owns token lifecycle via cookies
 *  - Accept-Language injected per-request from the i18n locale store
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// ─── Auth Route Guard ──────────────────────────────────────────────────────────

/**
 * Routes the 401 interceptor must NEVER attempt to refresh for.
 *
 *  /auth/login   → wrong credentials; a refresh token won't fix this
 *  /auth/refresh → the refresh token itself expired; refreshing again = infinite loop
 *  /auth/logout  → intentional session end; skip all auth logic
 *  /auth/me      → bootstrap call; 401 after refresh failure → force logout
 */
const SKIP_REFRESH_ROUTES = [
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
  "/auth/me",
]

function isSkippedRoute(url: string | undefined): boolean {
  if (!url) return false
  return SKIP_REFRESH_ROUTES.some((route) => url.includes(route))
}

// ─── Queue System ──────────────────────────────────────────────────────────────

/**
 * While a token refresh is in-flight, subsequent 401s are queued here.
 *
 * Each entry holds resolve/reject of its outer Promise.
 * After refresh settles, we drain the queue:
 *   success → each entry retries its original request
 *   failure → each entry rejects with the refresh error
 */
type QueueEntry = {
  retry: () => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let pendingQueue: QueueEntry[] = []

function drainQueue(error: unknown): void {
  const queue = pendingQueue
  pendingQueue = []

  if (error) {
    queue.forEach(({ reject }) => reject(error))
  } else {
    queue.forEach(({ retry }) => retry())
  }
}

// ─── Request Interceptor ───────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    NProgress.start()

    // Dynamically inject the user's locale so the backend can localise
    // error messages, validation strings, etc.
    config.headers["Accept-Language"] = getStoredLocale()

    return config
  },
  (error: unknown) => {
    NProgress.done()
    return Promise.reject(error)
  },
)

// ─── Response Interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()
    return response
  },

  async (error: AxiosError) => {
    NProgress.done()

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // ── Guard 1: Not a 401 → pass through unchanged ───────────────────────────
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // ── Guard 2: Auth routes must never trigger a refresh ─────────────────────
    if (isSkippedRoute(originalRequest?.url)) {
      return Promise.reject(error)
    }

    // ── Guard 3: Already retried → break infinite loop ────────────────────────
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    // ── Refresh in-flight: queue this request and wait ────────────────────────
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        pendingQueue.push({
          retry: () => api(originalRequest).then(resolve).catch(reject),
          reject,
        })
      })
    }

    // ── No refresh in-flight: be the one to trigger it ────────────────────────
    originalRequest._retry = true
    isRefreshing = true

    try {
      // Browser sends HttpOnly refresh cookie automatically — no manual header
      await api.post("/auth/refresh")

      // Refresh succeeded: replay all queued requests
      drainQueue(null)

      // Replay the request that triggered the whole flow
      return api(originalRequest)
    } catch (refreshError) {
      // Refresh failed: drain queue with error, then force logout
      drainQueue(refreshError)

      // Global event → AuthProvider clears user state → Router → /login
      window.dispatchEvent(new CustomEvent("auth:unauthorized"))

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api