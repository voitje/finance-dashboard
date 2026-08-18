import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import type { User } from '@/entities/user'
import { apiClient } from '@/shared/api'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
} from '../model'

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  user: User
  token: string
}

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  try {
    const { data } = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials,
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        'Неверный email или пароль'
      throw new Error(message)
    }
    throw error
  }
}

export const fetchMe = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}

export const useLogin = () => {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: login,
    onMutate: () => {
      dispatch(loginStart())
    },
    onSuccess: (data) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
      dispatch(loginSuccess(data))
    },
    onError: (error: Error) => {
      dispatch(loginFailure(error.message || 'Неверный email или пароль'))
    },
  })
}

export const useLogout = () => {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: async () => undefined,
    onSuccess: () => {
      dispatch(logout())
    },
  })
}
