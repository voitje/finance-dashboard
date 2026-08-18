export interface User {
  id: string
  name: string
  email: string
}

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  status: AuthStatus
  error: string | null
}
