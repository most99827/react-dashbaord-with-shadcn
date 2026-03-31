import axiosInstance from "./axios"

export type SysAdminGroup = {
  id: number
  group_name: string
  privilege: Record<string, any> | null
  created_at: string
}

export type PaginatedGroups = {
  data: SysAdminGroup[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

type ApiEnvelope<T> = {
  success: boolean
  status_code: number
  message: string
  data: T
}

const ROUTE_CANDIDATES = {
  privileges: ["/sys/privileges"],
  groups: ["/sys/admin-groups"],
}

function isRecoverableRouteError(error: any) {
  const status = error?.response?.status
  const message = String(error?.response?.data?.message ?? "").toLowerCase()
  return status === 404 || message.includes("could not be found")
}

async function getWithFallback<T>(urls: string[], params?: Record<string, unknown>) {
  let lastError: unknown
  for (const url of urls) {
    try {
      return await axiosInstance.get<ApiEnvelope<T>>(url, { params })
    } catch (error: any) {
      if (!isRecoverableRouteError(error)) throw error
      lastError = error
    }
  }
  throw lastError
}

async function postWithFallback<TBody>(urls: string[], payload: TBody) {
  let lastError: unknown
  for (const url of urls) {
    try {
      return await axiosInstance.post(url, payload)
    } catch (error: any) {
      if (!isRecoverableRouteError(error)) throw error
      lastError = error
    }
  }
  throw lastError
}

async function putWithFallback<TBody>(urls: string[], payload: TBody) {
  let lastError: unknown
  for (const url of urls) {
    try {
      return await axiosInstance.put(url, payload)
    } catch (error: any) {
      if (!isRecoverableRouteError(error)) throw error
      lastError = error
    }
  }
  throw lastError
}

async function deleteWithFallback(urls: string[]) {
  let lastError: unknown
  for (const url of urls) {
    try {
      return await axiosInstance.delete(url)
    } catch (error: any) {
      if (!isRecoverableRouteError(error)) throw error
      lastError = error
    }
  }
  throw lastError
}

export const getSecurityGroupsApi = (params?: Record<string, unknown>) => {
  return getWithFallback<PaginatedGroups>(ROUTE_CANDIDATES.groups, params)
}

export const getPrivilegesApi = () => {
  return getWithFallback<Record<string, any>>(ROUTE_CANDIDATES.privileges)
}

export const createSecurityGroupApi = (payload: { group_name: string; privilege: Record<string, any> }) => {
  return postWithFallback(ROUTE_CANDIDATES.groups, payload)
}

export const updateSecurityGroupApi = (
  id: number,
  payload: { group_name: string; privilege: Record<string, any> },
) => {
  return putWithFallback(ROUTE_CANDIDATES.groups.map((base) => `${base}/${id}`), payload)
}

export const deleteSecurityGroupApi = (id: number) => {
  return deleteWithFallback(ROUTE_CANDIDATES.groups.map((base) => `${base}/${id}`))
}

