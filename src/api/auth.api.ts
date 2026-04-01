import api from "./axios"

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoginCredentials = {
  email: string
  password: string
  remember?: boolean
}

export type AuthUser = {
  user_id: number
  username: string
  name?: string
  email: string
  first_name: string | null
  last_name: string | null
  photo: string | null
  salesrep_id: number | null
  [key: string]: unknown
}

export type LoginApiResponse = {
  success: boolean
  status_code: number
  message: string
  data: {
    token: string
    user: AuthUser
  }
}

export type MeApiResponse = {
  success: boolean
  data: AuthUser | { user: AuthUser } | { data: AuthUser }
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Backend sets HttpOnly access + refresh cookies and returns { data: { user } }.
 * Excluded from 401 retry via SKIP_REFRESH_ROUTES guard in axios.ts.
 */
export const loginApi = (credentials: LoginCredentials) =>
  api.post<LoginApiResponse>("/auth/login", credentials)

/**
 * POST /auth/refresh
 * Browser sends HttpOnly refresh cookie automatically (withCredentials: true).
 * Backend rotates both cookies.
 * Excluded from 401 retry — calling this on its own 401 would be an infinite loop.
 */
export const refreshApi = () => api.post("/auth/refresh")

/**
 * POST /auth/logout
 * Backend invalidates and clears both JWT cookies server-side.
 * Excluded from 401 retry — user is intentionally ending their session.
 */
export const logoutApi = () => api.post("/auth/logout")

/**
 * GET /auth/me
 * Returns the authenticated user from the HttpOnly access cookie.
 * Called ONLY on app bootstrap (page refresh) to restore session.
 * Excluded from 401 retry — a 401 here after refresh failure means the
 * session is truly expired; the interceptor fires auth:unauthorized instead.
 */
export const getMeApi = () => api.get<MeApiResponse>("/auth/me")
