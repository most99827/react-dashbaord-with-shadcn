import { Monitor, Moon, Sun, Languages, Columns2, PanelTop } from "lucide-react"
import { useTheme } from "next-themes"
import AppLayout from "@/layouts/AppLayout"
import SettingsLayout from "@/layouts/settings/layout"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "@/i18n"
import { useLayoutPreference } from "@/layouts/LayoutProvider"

function HeadingSmall({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </header>
  )
}

export default function Appearance() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale } = useLocale()
  const { layout, setLayout } = useLayoutPreference()
  const t = useTranslations("settings")
  const common = useTranslations("common")

  const appearanceTabs = [
    { value: 'light', icon: Sun, label: t('light') },
    { value: 'dark', icon: Moon, label: t('dark') },
    { value: 'system', icon: Monitor, label: t('system') },
  ] as const

  const layoutTabs = [
    { value: 'sidebar', icon: Columns2, label: t('sidebar') },
    { value: 'header', icon: PanelTop, label: t('header') },
  ] as const

  const languageTabs = [
    { value: 'en', icon: Languages, label: common('english') },
    { value: 'ar', icon: Languages, label: common('arabic') },
  ] as const

  return (
    <AppLayout breadcrumbs={[{ title: t('appearanceSettings'), href: "/settings/appearance" }]}>
      <SettingsLayout>
        <div className="space-y-10">

          <div className="space-y-6">
            <HeadingSmall
              title={t('appearanceSettings')}
              description={t('appearanceDescription')}
            />

            <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              {appearanceTabs.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                    theme === value
                      ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                      : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                  )}
                >
                  <Icon className="-ms-1 h-4 w-4" />
                  <span className="ms-1.5 text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <HeadingSmall
              title={t('layoutSettings')}
              description={t('layoutDescription')}
            />

            <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              {layoutTabs.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setLayout(value as any)}
                  className={cn(
                    'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                    layout === value
                      ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                      : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                  )}
                >
                  <Icon className="-ms-1 h-4 w-4" />
                  <span className="ms-1.5 text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <HeadingSmall
              title={t('languageSettings')}
              description={t('languageDescription')}
            />

            <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              {languageTabs.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setLocale(value as any)}
                  className={cn(
                    'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                    locale === value
                      ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                      : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                  )}
                >
                  <Icon className="-ms-1 h-4 w-4" />
                  <span className="ms-1.5 text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
