import React from 'react'

import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout'

export default function AuthLayout({
  children,
  title,
  description,
  actions,
  ...props
}: {
  children: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <AuthLayoutTemplate title={title} description={description} actions={actions} {...props}>
      {children}
    </AuthLayoutTemplate>
  )
}
