import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "./useAuth"

type LocationState = {
  from?: {
    pathname?: string
  }
}

export default function GuestRoute() {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    const redirectTarget = (location.state as LocationState | null)?.from?.pathname || "/dashboard"
    return <Navigate to={redirectTarget} replace />
  }

  return <Outlet />
}
