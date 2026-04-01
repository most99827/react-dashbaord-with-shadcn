import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

// ---------------------------------------------------------------------------
// 1. Auto-discover all translation files via Vite glob import
//    Adding a new namespace = just drop a JSON file, no code changes needed.
// ---------------------------------------------------------------------------

type Messages = Record<string, unknown>

/**
 * Eagerly import every JSON file matching ./[locale]/[namespace].json
 * Vite handles tree-shaking & code-splitting automatically.
 */
const modules = import.meta.glob<Messages>("./*/*.json", {
  eager: true,
  import: "default",
})

// Build structured resources: { en: { common: {...}, auth: {...} }, ar: {...} }
type Resources = Record<string, Record<string, Messages>>

const resources: Resources = {}

for (const [path, messages] of Object.entries(modules)) {
  const match = path.match(/^\.\/([^/]+)\/([^/]+)\.json$/)
  if (!match) continue

  const [, locale, namespace] = match
  resources[locale] ??= {}
  resources[locale][namespace] = messages
}

// ---------------------------------------------------------------------------
// 2. Public types
// ---------------------------------------------------------------------------

export type Locale = "en" | "ar"
export type Namespace = keyof (typeof resources)["en"]
export type Direction = "ltr" | "rtl"

/** All auto-discovered locale codes */
export const SUPPORTED_LOCALES = Object.keys(resources) as Locale[]

/** All auto-discovered namespace names */
export const SUPPORTED_NAMESPACES = Object.keys(resources.en ?? {}) as Namespace[]

// ---------------------------------------------------------------------------
// 3. Translation utilities
// ---------------------------------------------------------------------------

/** Resolve a dot-notation path on a nested object: "nav.workspace" → obj.nav.workspace */
function deepGet(obj: unknown, path: string): string | undefined {
  let current: unknown = obj
  for (const segment of path.split(".")) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Record<string, unknown>)[segment]
  }
  return typeof current === "string" ? current : undefined
}

/**
 * Replace `{{key}}` or `{key}` placeholders with provided values.
 *
 *   interpolate("Hello, {{name}}!", { name: "Ahmad" })  →  "Hello, Ahmad!"
 */
function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template
  return template.replace(
    /\{\{?\s*(\w+)\s*\}?\}/g,
    (match, key: string) => (key in params ? String(params[key]) : match),
  )
}

/** Deep-merge two objects (fallback ← primary). Strings in `primary` win. */
function deepMerge(fallback: Messages, primary: Messages): Messages {
  const result: Messages = { ...fallback }
  for (const key of Object.keys(primary)) {
    const fVal = fallback[key]
    const pVal = primary[key]
    if (
      pVal != null &&
      typeof pVal === "object" &&
      !Array.isArray(pVal) &&
      fVal != null &&
      typeof fVal === "object" &&
      !Array.isArray(fVal)
    ) {
      result[key] = deepMerge(fVal as Messages, pVal as Messages)
    } else {
      result[key] = pVal
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// 4. Translator function type & factory
// ---------------------------------------------------------------------------

/**
 * A `t()` function returned by `useTranslations`.
 *
 * @example
 *   t("title")                               // simple key
 *   t("nav.workspace")                        // dot-notation for nested keys
 *   t("greeting", { name: "Ahmad" })           // interpolation
 */
export type TranslatorFn = (
  key: string,
  params?: Record<string, string | number>,
) => string

const DEFAULT_LOCALE: Locale = "en"

function createTranslator(
  locale: Locale,
  namespace: string,
): TranslatorFn {
  const primary = resources[locale]?.[namespace] ?? {}
  const fallback = locale !== DEFAULT_LOCALE
    ? resources[DEFAULT_LOCALE]?.[namespace] ?? {}
    : primary
  const merged = locale !== DEFAULT_LOCALE ? deepMerge(fallback, primary) : primary

  return (key: string, params?: Record<string, string | number>): string => {
    const value = deepGet(merged, key)
    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation key: "${namespace}.${key}" for locale "${locale}"`)
      }
      // Return the last segment of the key as a human-readable fallback
      return key
    }
    return interpolate(value, params)
  }
}

// ---------------------------------------------------------------------------
// 5. Context & Provider
// ---------------------------------------------------------------------------

const LOCALE_STORAGE_KEY = "locale"

type I18nContextValue = {
  locale: Locale
  dir: Direction
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

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
  if (typeof window === "undefined") return DEFAULT_LOCALE
  return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
}

export function persistLocale(locale: Locale) {
  const normalized = normalizeLocale(locale)

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, normalized)
  }

  applyDocumentLocale(normalized)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale())

  useEffect(() => {
    persistLocale(locale)
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: getDirection(locale),
      setLocale: (next: Locale) => setLocaleState(normalizeLocale(next)),
      toggleLocale: () =>
        setLocaleState((cur) => (cur === "en" ? "ar" : "en")),
    }),
    [locale],
  )

  return createElement(I18nContext.Provider, { value }, children)
}

// ---------------------------------------------------------------------------
// 6. Hooks
// ---------------------------------------------------------------------------

/**
 * Access locale, direction, and locale switching functions.
 */
export function useLocale() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useLocale must be used within an I18nProvider")
  }

  return context
}

/**
 * Returns a `t()` function scoped to the given namespace.
 * Supports **dot-notation**, **interpolation**, and **automatic fallback** to English.
 *
 * @example
 *   const t = useTranslations("common")
 *   t("nav.workspace")                       // dot-notation for nested keys
 *   t("greeting", { name: "Ahmad" })          // interpolation: "Hello, {{name}}!"
 *
 * @example
 *   // Using multiple namespaces in one component
 *   const t       = useTranslations("settings")
 *   const common  = useTranslations("common")
 *
 *   t("title")          // → "Settings"
 *   common("nav.setup") // → "Setup"
 */
export function useTranslations(namespace: string): TranslatorFn {
  const { locale } = useLocale()
  return useMemo(() => createTranslator(locale, namespace), [locale, namespace])
}
