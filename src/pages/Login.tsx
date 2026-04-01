import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

import { useAuth } from "@/auth/useAuth"
import AppLogoIcon from "@/layouts/app/components/app-logo-icon"
import LanguageToggle from "@/components/LanguageToggle"
import LoginForm from "@/components/LoginForm"
import ThemeToggle from "@/components/ThemeToggle"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useTranslations } from "@/i18n"
import AuthLayout from "@/layouts/auth-layout"
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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(11,92,255,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-foreground transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] h-52 w-52 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-400/10" />
        <div className="absolute bottom-[12%] right-[8%] h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl dark:bg-indigo-500/10" />
      </div>

      <AuthLayout
        title=""
        description=""
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-white/50 bg-white/55 shadow-2xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 dark:shadow-black/20">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
                <AppLogoIcon className="size-7 fill-current" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <LoginForm
                onSubmit={handleLogin}
                getErrorMessage={getErrorMessage}
              />
            </CardContent>
          </Card>
        </div>
      </AuthLayout>
    </main>
  )
}
