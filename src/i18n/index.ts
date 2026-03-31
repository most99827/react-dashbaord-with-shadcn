import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import arAuth from "./ar/auth.json"
import arCommon from "./ar/common.json"
import arDashboard from "./ar/dashboard.json"
import arMarketplaces from "./ar/marketplaces.json"
import arSettings from "./ar/settings.json"
import enAuth from "./en/auth.json"
import enCommon from "./en/common.json"
import enDashboard from "./en/dashboard.json"
import enMarketplaces from "./en/marketplaces.json"
import enSettings from "./en/settings.json"

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    marketplaces: enMarketplaces,
    settings: enSettings,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    dashboard: arDashboard,
    marketplaces: arMarketplaces,
    settings: arSettings,
  },
} as const

export type Locale = keyof typeof resources
export type Namespace = keyof (typeof resources)["en"]
export type CommonMessages = (typeof resources)["en"]["common"]
export type AuthMessages = (typeof resources)["en"]["auth"]
export type DashboardMessages = (typeof resources)["en"]["dashboard"]

type Direction = "ltr" | "rtl"

type I18nContextValue = {
  locale: Locale
  dir: Direction
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LOCALE_STORAGE_KEY = "locale"

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

function getDirection(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr"
}

function normalizeLocale(value: string | null | undefined): Locale {
  return value === "ar" ? "ar" : "en"
}

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return

  const direction = getDirection(locale)
  document.documentElement.lang = locale
  document.documentElement.dir = direction
  document.documentElement.style.direction = direction
}

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en"

  return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
}

export function persistLocale(locale: Locale) {
  const normalizedLocale = normalizeLocale(locale)

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, normalizedLocale)
  }

  applyDocumentLocale(normalizedLocale)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale())

  useEffect(() => {
    persistLocale(locale)
  }, [locale])

  const value = useMemo(() => {
    const setLocale = (nextLocale: Locale) => {
      setLocaleState(normalizeLocale(nextLocale))
    }

    const toggleLocale = () => {
      setLocaleState((currentLocale) => (currentLocale === "en" ? "ar" : "en"))
    }

    return {
      locale,
      dir: getDirection(locale),
      setLocale,
      toggleLocale,
    }
  }, [locale])

  return createElement(I18nContext.Provider, { value }, children)
}

export function useLocale() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useLocale must be used within an I18nProvider")
  }

  return context
}

export function useTranslations<N extends Namespace>(namespace: N): (typeof resources)["en"][N] {
  const { locale } = useLocale()
  return resources[locale][namespace]
}
