import type { AuthState } from '@/entities/user'

type StateWithAuth = { auth: AuthState }

export const selectCurrentUser = (state: StateWithAuth) => state.auth.user

export const selectIsAuthenticated = (state: StateWithAuth) =>
  state.auth.isAuthenticated

export const selectAuthStatus = (state: StateWithAuth) => state.auth.status

export const selectAuthError = (state: StateWithAuth) => state.auth.error

export const selectToken = (state: StateWithAuth) => state.auth.token
