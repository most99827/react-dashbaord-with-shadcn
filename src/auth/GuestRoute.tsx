import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "./useAuth"

export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Outlet />
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
