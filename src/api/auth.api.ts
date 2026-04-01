import api from "./api"

export type LoginCredentials = {
  email: string
  password: string
  remember?: boolean
}

export type AuthUser = {
  user_id: number
  username: string
  name?: string
  email: string
  first_name: string | null
  last_name: string | null
  photo: string | null
  salesrep_id: number | null
  [key: string]: unknown
}

export type LoginApiResponse = {
  success: boolean
  status_code: number
  message: string
  data: {
    user: AuthUser
    token?: string
  }
}

export type MeApiResponse = {
  success: boolean
  data: AuthUser | { user: AuthUser } | { data: AuthUser }
}

export const loginApi = (credentials: LoginCredentials) =>
  api.post<LoginApiResponse>("/auth/login", credentials)

export const logoutApi = () => api.post("/auth/logout")

export const getMeApi = () => api.get<MeApiResponse>("/auth/me")
