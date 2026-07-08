import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { runtimeConfig } from '@/app/runtimeConfig'
import { expireLoginSession, getLoginSessionAccessToken, refreshLoginSession } from '@/api/session'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const request = axios.create({
  baseURL: runtimeConfig.apiBaseURL,
  timeout: runtimeConfig.requestTimeoutMs,
})

request.interceptors.request.use((config) => {
  const token = getLoginSessionAccessToken()

  if (token) {
    config.headers.set('Blade-Auth', `bearer ${token}`)
  }

  return config
})

request.interceptors.response.use(
  response => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error)
    }

    const config = error.config as RetryableRequestConfig

    if (config._retry) {
      expireLoginSession()
      return Promise.reject(error)
    }

    config._retry = true

    try {
      const data = await refreshLoginSession()
      config.headers.set('Blade-Auth', `bearer ${data.access_token}`)
      return request(config)
    }
    catch (refreshError) {
      expireLoginSession()
      return Promise.reject(refreshError instanceof Error ? refreshError : error as AxiosError)
    }
  },
)
