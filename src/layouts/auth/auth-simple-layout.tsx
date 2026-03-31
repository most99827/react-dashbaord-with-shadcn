import type { PropsWithChildren, ReactNode } from 'react'

type AuthSimpleLayoutProps = PropsWithChildren<{
  title?: string
  description?: string
  actions?: ReactNode
}>

export default function AuthSimpleLayout({
  children,
  title,
  description,
  actions,
}: AuthSimpleLayoutProps) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-start justify-center px-3 py-4 sm:items-center sm:px-4 sm:py-8">
      <div className="w-full max-w-md">
        {actions ? <div className="mb-3 flex justify-end gap-2 sm:mb-4">{actions}</div> : null}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 sm:p-6">
          <div className="mb-4 text-center">
            {title ? <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1> : null}
            {description ? <p className="text-sm text-slate-500 sm:text-base">{description}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
