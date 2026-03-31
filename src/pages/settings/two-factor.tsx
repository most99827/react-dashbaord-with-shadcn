import { useState } from "react"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/AppLayout"
import SettingsLayout from "@/layouts/settings/layout"

function HeadingSmall({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </header>
  )
}

export default function TwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false)

  return (
    <AppLayout breadcrumbs={[{ title: "Two-Factor Authentication", href: "/settings/two-factor" }]}>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Two-Factor Authentication"
            description="Add additional security to your account using two-factor authentication."
          />

          <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h4 className="font-semibold mb-2">
              {isEnabled ? "You have enabled two-factor authentication." : "You have not enabled two-factor authentication."}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              When two-factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.
            </p>

            <Button onClick={() => setIsEnabled(!isEnabled)} variant={isEnabled ? "destructive" : "default"}>
              {isEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
