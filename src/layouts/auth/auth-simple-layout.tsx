import type { PropsWithChildren, ReactNode } from 'react'

type AuthSimpleLayoutProps = PropsWithChildren<{
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}>

export default function AuthSimpleLayout({
  children,
  title,
  description,
  actions,
}: AuthSimpleLayoutProps) {
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-5xl items-center justify-center overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
      <div className="w-full max-w-md">
        {actions ? <div className="mb-2 flex justify-end gap-2 sm:mb-3">{actions}</div> : null}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 sm:p-5">
          <div className="mb-3 text-center">
            {title ? <h1 className="text-xl font-bold sm:text-2xl">{title}</h1> : null}
            {description ? <p className="text-xs text-slate-500 sm:text-sm">{description}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
