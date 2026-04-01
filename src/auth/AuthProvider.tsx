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
import { AUTH_UNAUTHORIZED_EVENT } from "@/auth/auth-helpers"

type AuthContextType = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function extractUser(payload: unknown): AuthUser | null {
  if (!isRecord(payload)) return null

  const data = payload.data

  if (isRecord(data) && "user_id" in data) {
    return data as AuthUser
  }

  if (isRecord(data) && isRecord((data as Record<string, unknown>).user)) {
    return (data as Record<string, unknown>).user as AuthUser
  }

  if (isRecord(data) && isRecord((data as Record<string, unknown>).data)) {
    return (data as Record<string, unknown>).data as AuthUser
  }

  if (isRecord(payload.user)) {
    return payload.user as AuthUser
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuthState = useCallback(() => {
    setUser(null)
  }, [])

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

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
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
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)

    try {
      await logoutApi()
    } catch {
      // Clear local state even if backend session was already invalid.
    } finally {
      clearAuthState()
      setIsLoading(false)
    }
  }, [clearAuthState])

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

    const handleUnauthorized = () => {
      clearAuthState()
      setIsLoading(false)
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)

    return () => {
      isSubscribed = false
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
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

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }

  return context
}
