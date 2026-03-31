import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false })

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Required: sends the HttpOnly JWT cookie on every request automatically.
  // No manual Authorization header needed — the browser handles it.
  withCredentials: true,
})

// ─── Queue System ─────────────────────────────────────────────────────────────

type QueueEntry = {
  resolve: (value: unknown) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueEntry[] = []

/**
 * Flush all queued requests after a refresh attempt.
 * - On success (error = null): each queued promise resolves, triggering a retry.
 * - On failure (error ≠ null): each queued promise rejects with the error.
 */
function processQueue(error: unknown): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(undefined)
    }
  })

  failedQueue = []
}

// ─── Auth Route Guard ─────────────────────────────────────────────────────────

/**
 * Routes that should NEVER be intercepted or retried.
 * Prevents infinite loops on the refresh/login endpoints themselves.
 */
const AUTH_ROUTES = ["/auth/login", "/auth/refresh", "/auth/logout"]

function isAuthRoute(config: InternalAxiosRequestConfig | undefined): boolean {
  if (!config?.url) return false
  return AUTH_ROUTES.some((route) => config.url!.includes(route))
}

api.interceptors.request.use(
  (config) => {
    NProgress.start()
    return config
  },
  (error) => {
    NProgress.done()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response
  },

  async (error: AxiosError) => {
    NProgress.done()
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // 1. Only handle 401 Unauthorized
    // 2. Skip auth routes (login / refresh / logout) — avoids infinite loops
    // 3. Skip already-retried requests — prevents retry storms
    if (
      error.response?.status !== 401 ||
      isAuthRoute(originalRequest) ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    // ── Refresh already in progress: queue this request ──────────────────────
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        })
      })
    }

    // ── Trigger a single refresh token call ──────────────────────────────────
    isRefreshing = true

    try {
      // Browser sends the HttpOnly refresh cookie automatically (withCredentials)
      await api.post("/auth/refresh")

      processQueue(null)

      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)

      // Notify AuthProvider cleanly — React Router handles the /login redirect
      window.dispatchEvent(new CustomEvent("auth:unauthorized"))

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api