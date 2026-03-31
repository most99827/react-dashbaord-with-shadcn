import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "@/i18n"
import AuthLayout from "@/layouts/auth-layout"

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
    remember: false,
  })
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const auth = useTranslations("auth")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    setTimeout(() => {
      if (data.username === "admin" && data.password === "password") {
        navigate("/home")
      } else {
        setErrors({
          username: data.username !== "admin" ? auth.authError : "",
          password: data.password !== "password" ? auth.authError : "",
        })
      }
      setProcessing(false)
    }, 1000)
  }

  return (
    <AuthLayout
      title={auth.loginTitle}
      description={auth.loginDescription}
    >
      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">{auth.username}</Label>
            <Input
              id="username"
              type="text"
              name="username"
              required
              autoFocus
              tabIndex={1}
              autoComplete="username"
              placeholder={auth.usernamePlaceholder}
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <InputError message={errors.username} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{auth.password}</Label>
              <TextLink
                to="/forgot-password"
                className="ml-auto text-sm"
                tabIndex={5}
              >
                {auth.forgotPassword}
              </TextLink>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              required
              tabIndex={2}
              autoComplete="current-password"
              placeholder={auth.passwordPlaceholder}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="remember"
              name="remember"
              tabIndex={3}
              checked={data.remember}
              onCheckedChange={(checked) => setData({ ...data, remember: !!checked })}
            />
            <Label htmlFor="remember">{auth.rememberMe}</Label>
          </div>

          <Button
            type="submit"
            className="mt-4 w-full"
            tabIndex={4}
            disabled={processing}
            data-test="login-button"
          >
            {processing && <Spinner />}
            {auth.submit}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {auth.noAccount}{" "}
          <TextLink to="/register" tabIndex={5}>
            {auth.signUp}
          </TextLink>
        </div>
      </form>
    </AuthLayout>
  )
}
