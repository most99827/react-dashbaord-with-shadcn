import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

import {
  dispatchUnauthorized,
  isLoginPath,
  isSkippedAuthRoute,
} from "@/auth/auth-helpers"
import { getStoredLocale } from "@/i18n"

NProgress.configure({ showSpinner: false })

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

type QueueItem = {
  resolve: () => void
  reject: (error: unknown) => void
}

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL) as string,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

let isRefreshing = false
let failedQueue: QueueItem[] = []

function processQueue(error: unknown): void {
  const queue = failedQueue
  failedQueue = []

  if (error) {
    queue.forEach(({ reject }) => reject(error))
    return
  }

  queue.forEach(({ resolve }) => resolve())
}

function refreshAccessToken(): Promise<AxiosResponse> {
  return axios.post(
    "/auth/refresh",
    {},
    {
      baseURL: api.defaults.baseURL,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Accept-Language": getStoredLocale(),
      },
    },
  )
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    NProgress.start()

    config.withCredentials = true
    config.headers["Accept-Language"] = getStoredLocale()

    return config
  },
  (error: unknown) => {
    NProgress.done()
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()
    return response
  },
  async (error: AxiosError) => {
    NProgress.done()

    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (isSkippedAuthRoute(originalRequest.url) || isLoginPath()) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      dispatchUnauthorized("unauthorized-after-retry")
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve: () => {
            api(originalRequest).then(resolve).catch(reject)
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      await refreshAccessToken()
      processQueue(null)
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      dispatchUnauthorized("refresh-failed")
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
