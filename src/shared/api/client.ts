import axios from 'axios'
import { toast } from 'sonner'
import { API_BASE_URL, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/shared/lib'
import { triggerLogout } from './auth-bridge'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      })

      if (error.response?.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)
        triggerLogout()
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign('/login')
        }
      } else if (error.response?.status && error.response.status >= 500) {
        toast.error('Ошибка сервера. Попробуйте позже')
      } else if (!error.response) {
        toast.error('Нет соединения с сервером')
      }
    } else {
      console.error('[API Error]', error)
      toast.error('Нет соединения с сервером')
    }

    return Promise.reject(error)
  },
)
