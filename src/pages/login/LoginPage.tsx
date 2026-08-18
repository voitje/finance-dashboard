import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LoginForm, selectIsAuthenticated, selectAuthStatus } from '@/features/auth'

export const LoginPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const status = useSelector(selectAuthStatus)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (status !== 'loading') {
      setIsReady(true)
    }
  }, [status])

  if (!isReady) {
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

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Finance Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Finance Dashboard
        </h1>
      </div>
      <LoginForm />
    </div>
  )
}
