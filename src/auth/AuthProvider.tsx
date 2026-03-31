import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { AuthUser, LoginCredentials } from "@/api/auth.api"
import { getMeApi, loginApi, logoutApi } from "@/api/auth.api"

// ─── Context Types ────────────────────────────────────────────────────────────

type AuthContextType = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ─── User Extraction Helper ───────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Safely extracts the user object from a /auth/me response.
 * Handles multiple common backend response shapes.
 */
function extractUser(payload: unknown): AuthUser | null {
  if (!isRecord(payload)) return null

  const data = payload.data

  // Shape: { data: { user_id, ... } }  — user is data directly
  if (isRecord(data) && "user_id" in data) {
    return data as AuthUser
  }

  // Shape: { data: { user: { user_id, ... } } }
  if (isRecord(data) && isRecord((data as Record<string, unknown>).user)) {
    return (data as Record<string, unknown>).user as AuthUser
  }

  // Shape: { data: { data: { user_id, ... } } }
  if (isRecord(data) && isRecord((data as Record<string, unknown>).data)) {
    return (data as Record<string, unknown>).data as AuthUser
  }

  // Shape: { user: { user_id, ... } }
  if (isRecord(payload.user)) {
    return payload.user as AuthUser
  }

  return null
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuthState = useCallback(() => {
    setUser(null)
  }, [])

  /**
   * Restores session on page refresh by calling /auth/me.
   * The HttpOnly cookie is sent automatically (withCredentials: true in axios).
   */
  const refreshAuth = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const response = await getMeApi()
      const nextUser = extractUser(response.data)

      if (!nextUser) {
        clearAuthState()
        return null
      }

      setUser(nextUser)
      return nextUser
    } catch {
      clearAuthState()
      return null
    }
  }, [clearAuthState])

  /**
   * Login flow:
   * 1. POST /auth/login → backend sets HttpOnly JWT cookie
   * 2. User is taken directly from the response body — no /auth/me call needed.
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setIsLoading(true)

      try {
        const response = await loginApi(credentials)
        const nextUser = response.data?.data?.user ?? null

        if (!nextUser) {
          throw new Error("Login succeeded but no user was returned.")
        }

        setUser(nextUser)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  /**
   * Logout: always clear local state, even if the backend call fails.
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)

    try {
      await logoutApi()
    } catch {
      // Backend may already have expired the session — clear anyway.
    } finally {
      clearAuthState()
      setIsLoading(false)
    }
  }, [clearAuthState])

  // ── Bootstrap: restore session on mount / page refresh ────────────────────
  useEffect(() => {
    let isSubscribed = true

    async function bootstrapAuth() {
      setIsLoading(true)
      await refreshAuth()

      if (isSubscribed) {
        setIsLoading(false)
      }
    }

    void bootstrapAuth()

    // Fired by axios interceptor when the refresh token itself expires
    const handleUnauthorized = () => {
      clearAuthState()
      setIsLoading(false)
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized)

    return () => {
      isSubscribed = false
      window.removeEventListener("auth:unauthorized", handleUnauthorized)
    }
  }, [clearAuthState, refreshAuth])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshAuth,
    }),
    [user, isLoading, login, logout, refreshAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }

  return context
}
