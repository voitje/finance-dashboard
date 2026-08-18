import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/app/providers/with-auth'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { AppLayout } from '@/app/layout'
import { PageSkeleton } from '@/shared/ui/PageSkeleton'

const LoginPage = lazy(() =>
  import('@/pages/login').then((module) => ({ default: module.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard').then((module) => ({
    default: module.DashboardPage,
  })),
)
const TransactionsPage = lazy(() =>
  import('@/pages/transactions').then((module) => ({
    default: module.TransactionsPage,
  })),
)
const BudgetPage = lazy(() =>
  import('@/pages/budget').then((module) => ({ default: module.BudgetPage })),
)

const SuspensePage = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
  </ErrorBoundary>
)

const ProtectedLayout = () => (
  <ProtectedRoute>
    <AppLayout />
  </ProtectedRoute>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <SuspensePage>
        <LoginPage />
      </SuspensePage>
    ),
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <SuspensePage>
            <DashboardPage />
          </SuspensePage>
        ),
      },
      {
        path: 'transactions',
        element: (
          <SuspensePage>
            <TransactionsPage />
          </SuspensePage>
        ),
      },
      {
        path: 'budget',
        element: (
          <SuspensePage>
            <BudgetPage />
          </SuspensePage>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
