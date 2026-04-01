import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const t = useTranslations("settings")

  const navItems = [
    { title: t("profile"), href: "/settings/profile" },
    { title: t("password"), href: "/settings/password" },
    // { title: t("twoFactor"), href: "/settings/two-factor" },
    { title: t("appearance"), href: "/settings/appearance" },
  ]

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        <aside className="w-full lg:w-48">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive && "bg-muted")}
                  asChild
                >
                  <Link to={item.href}>{item.title}</Link>
                </Button>
              )
            })}
          </nav>
        </aside>

        <div className="mt-6 lg:mt-0 lg:hidden border-t border-border my-6"></div>

        <div className="flex-1 md:max-w-2xl mt-6 lg:mt-0">
          <section className="max-w-xl space-y-12">
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
