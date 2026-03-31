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

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Backend sets HttpOnly JWT cookie + returns { data: { token, user } }.
 * NOT intercepted for 401 retry — excluded via isAuthRoute guard in axios.ts.
 */
export const loginApi = (credentials: LoginCredentials) =>
  api.post<LoginApiResponse>("/auth/login", credentials)

/**
 * POST /auth/refresh
 * Browser sends HttpOnly refresh cookie automatically (withCredentials).
 * Backend rotates and re-sets cookies.
 * NOT intercepted for 401 retry — excluded via isAuthRoute guard in axios.ts.
 */
export const refreshApi = () => api.post("/auth/refresh")

/**
 * POST /auth/logout
 * Backend invalidates and clears the JWT cookies.
 * NOT intercepted for 401 retry — excluded via isAuthRoute guard in axios.ts.
 */
export const logoutApi = () => api.post("/auth/logout")

/**
 * GET /auth/me
 * Returns the authenticated user using the HttpOnly cookie.
 * IS intercepted — a 401 here triggers the silent refresh flow.
 * Called ONLY on page refresh to restore session (not after login).
 */
export const getMeApi = () => api.get("/auth/me")
