import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AuthProvider } from "@/auth/AuthProvider"
import GuestRoute from "@/auth/GuestRoute"
import ProtectedRoute from "@/auth/ProtectedRoute"
import Dashboard from "@/pages/Dashboard"
import FullUnloadRequestsPage from "@/pages/FullUnloadRequests"
import LoginPage from "@/pages/Login"
import SecurityGroupsPage from "@/pages/setup/securityGroups/index"
import UsersPage from "@/pages/Users"
import MarketplacesPage from "@/pages/setup/marketplaces/Index"
import ProfilePage from "@/pages/settings/profile"
import PasswordPage from "@/pages/settings/password"
import AppearancePage from "@/pages/settings/appearance"
import TwoFactorPage from "@/pages/settings/two-factor"
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/marketplaces" element={<MarketplacesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/setup/groups" element={<SecurityGroupsPage />} />
            <Route path="/security-group" element={<Navigate to="/setup/groups" replace />} />
            <Route path="/full-unload-requests" element={<FullUnloadRequestsPage />} />
            <Route path="/settings/profile" element={<ProfilePage />} />
            <Route path="/settings/password" element={<PasswordPage />} />
            <Route path="/settings/appearance" element={<AppearancePage />} />
            <Route path="/settings/two-factor" element={<TwoFactorPage />} />
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
