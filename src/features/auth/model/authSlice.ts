import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '@/entities/user'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/shared/lib'

export { AUTH_TOKEN_KEY, AUTH_USER_KEY }

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'loading',
  error: null,
}

type LoginSuccessPayload = {
  user: User
  token: string
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.status = 'loading'
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.status = 'succeeded'
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.status = 'failed'
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    },
    clearError: (state) => {
      state.error = null
      if (state.status === 'failed') {
        state.status = 'idle'
      }
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError } =
  authSlice.actions

export const authReducer = authSlice.reducer
