import { useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { AuthMessages, Locale } from "@/i18n"

type LoginFormProps = {
  copy: AuthMessages
  locale: Locale
  onSubmit: (credentials: {
    email: string
    password: string
    remember: boolean
  }) => Promise<void>
  getErrorMessage: (error: unknown) => string
}

type Errors = {
  email?: string
  password?: string
  form?: string
}

export default function LoginForm({
  copy,
  locale,
  onSubmit,
  getErrorMessage,
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const isArabic = locale === "ar"

  function validate() {
    const nextErrors: Errors = {}
    const emailValue = email.trim()

    if (!emailValue) {
      nextErrors.email = copy.requiredEmail
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = copy.invalidEmail
    }

    if (!password.trim()) {
      nextErrors.password = copy.requiredPassword
    }

    return nextErrors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setErrors({})

    try {
      await onSubmit({
        email: email.trim(),
        password,
        remember,
      })
    } catch (error) {
      setErrors({ form: getErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">{copy.email}</Label>
        <div className="relative">
          <Mail
            className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${
              isArabic ? "right-3" : "left-3"
            }`}
          />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={copy.emailPlaceholder}
            disabled={isSubmitting}
            className={`${isArabic ? "pr-10 pl-3" : "pl-10 pr-3"} h-11 rounded-xl border-white/50 bg-white/60 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5`}
          />
        </div>
        {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{copy.password}</Label>
        <div className="relative">
          <Lock
            className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${
              isArabic ? "right-3" : "left-3"
            }`}
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            disabled={isSubmitting}
            className={`${isArabic ? "px-10" : "pl-10 pr-10"} h-11 rounded-xl border-white/50 bg-white/60 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? copy.hidePassword : copy.showPassword}
            className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground ${
              isArabic ? "left-3" : "right-3"
            }`}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
      </div>

      <div className="flex items-center rounded-xl border border-white/40 bg-white/45 px-3 py-2 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(checked) => setRemember(Boolean(checked))}
            disabled={isSubmitting}
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            {copy.rememberMe}
          </Label>
        </div>
      </div>

      {errors.form ? (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.form}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition-all hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4" />
            {copy.submitting}
          </span>
        ) : (
          copy.submit
        )}
      </Button>
    </form>
  )
}
