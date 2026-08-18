import type { ReactNode } from 'react'
import { withQuery } from './with-query'
import { withRedux } from './with-redux'
import { withRouter } from './with-router'
import { AuthBootstrap } from './with-auth'

export const Providers = ({ children }: { children?: ReactNode }) => {
  return withRedux(
    withQuery(<AuthBootstrap>{children ?? withRouter()}</AuthBootstrap>),
  )
}

export { ProtectedRoute, AuthBootstrap } from './with-auth'
export { ErrorBoundary } from './ErrorBoundary'
