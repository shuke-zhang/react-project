import axios from 'axios'
import { clearAuthCache, getCacheToken } from '@/utils/cache'

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 20 * 1000,
})

request.interceptors.request.use((config) => {
  const token = getCacheToken()

  if (token) {
    config.headers.set('Blade-Auth', `bearer ${token}`)
  }

  return config
})

request.interceptors.response.use(
  response => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthCache()
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }

    return Promise.reject(error)
  },
)
