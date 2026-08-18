import { useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { User } from '@/entities/user'
import { registerLogoutHandler } from '@/shared/api'
import {
  loginSuccess,
  logout,
  selectIsAuthenticated,
  selectAuthStatus,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
} from '@/features/auth'

/** Restores auth from localStorage on app start */
export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    registerLogoutHandler(() => {
      dispatch(logout())
    })

    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userRaw = localStorage.getItem(AUTH_USER_KEY)

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as User
        if (user?.id && user?.email) {
          dispatch(loginSuccess({ user, token }))
          return
        }
      } catch {
        // fall through to logout
      }
    }

    dispatch(logout())
  }, [dispatch])

  return children
}

/** Guards protected routes */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const status = useSelector(selectAuthStatus)

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"
          role="status"
          aria-label="Загрузка"
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
