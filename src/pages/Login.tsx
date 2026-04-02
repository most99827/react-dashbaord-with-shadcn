import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

import { useAuth } from "@/auth/useAuth"
import LanguageToggle from "@/components/LanguageToggle"
import LoginForm from "@/components/LoginForm"
import ThemeToggle from "@/components/ThemeToggle"
import { useTranslations } from "@/i18n"
import AuthLayout from "@/layouts/auth-layout"
import AppLogoIcon from "@/layouts/app/components/app-logo-icon"
import { getPreferredTheme, persistTheme } from "@/lib/theme"

type LocationState = {
  from?: {
    pathname?: string
  }
}

function getRedirectTarget(location: ReturnType<typeof useLocation>): string {
  return (location.state as LocationState | null)?.from?.pathname || "/dashboard"
}

function extractApiErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null

  const data = payload as Record<string, unknown>

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error
  }

  if (Array.isArray(data.data) && data.data.length > 0) {
    const first = data.data[0]
    if (typeof first === "string" && first.trim()) {
      return first
    }
  }

  const errors = data.errors
  if (errors && typeof errors === "object") {
    const firstList = Object.values(errors as Record<string, unknown>)[0]
    if (Array.isArray(firstList) && firstList.length > 0 && typeof firstList[0] === "string") {
      return firstList[0]
    }
  }

  return null
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isBootstrapping } = useAuth()
  const [theme, setTheme] = useState<"light" | "dark">(getPreferredTheme)
  const common = useTranslations("common")
  const auth = useTranslations("auth")

  useEffect(() => {
    persistTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      navigate(getRedirectTarget(location), { replace: true })
    }
  }, [isAuthenticated, isBootstrapping, location, navigate])

  async function handleLogin(credentials: {
    email: string
    password: string
    remember: boolean
  }) {
    await login(credentials)
    navigate(getRedirectTarget(location), { replace: true })
  }

  function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = extractApiErrorMessage(error.response?.data)
      return message || auth("authError")
    }

    if (error instanceof Error && error.message) {
      return error.message
    }

    return auth("authError")
  }

  return (
    <main className="h-dvh overflow-hidden bg-slate-50 text-foreground transition-colors dark:bg-slate-950">
      <AuthLayout
        title={
          <>
            <span className="mb-2 flex justify-center">
              <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
                <AppLogoIcon className="size-5 fill-current" />
              </span>
            </span>
            <span>{auth("loginTitle")}</span>
          </>
        }
        description={auth("loginDescription")}
        actions={
          <>
            <ThemeToggle
              theme={theme}
              label={common("themeLabel")}
              onToggle={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
            />
            <LanguageToggle />
          </>
        }
      >
        <LoginForm onSubmit={handleLogin} getErrorMessage={getErrorMessage} />
      </AuthLayout>
    </main>
  )
}
