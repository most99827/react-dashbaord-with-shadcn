import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AppLayout from "@/layouts/AppLayout"
import SettingsLayout from "@/layouts/settings/layout"
import { useTranslations } from "@/i18n"

function HeadingSmall({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </header>
  )
}

export default function Password() {
  const t = useTranslations("settings")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  return (
    <AppLayout breadcrumbs={[{ title: t("password"), href: "/settings/password" }]}>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title={t("updatePassword")}
            description={t("updatePasswordDescription")}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="current_password">{t("password")}</Label>
              <Input
                id="current_password"
                type="password"
                required
                className="mt-1 block w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new_password">{t("password")}</Label>
              <Input
                id="new_password"
                type="password"
                required
                className="mt-1 block w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm_password">{t("password")}</Label>
              <Input
                id="confirm_password"
                type="password"
                required
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button disabled={loading}>
                {loading ? t("saving") : t("save")}
              </Button>
              {success && (
                <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-start-2">
                  {t("saved")}
                </p>
              )}
            </div>
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
