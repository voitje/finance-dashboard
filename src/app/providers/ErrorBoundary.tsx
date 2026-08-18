import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorFallback } from '@/shared/ui/ErrorFallback'

interface ErrorBoundaryProps {
  children: ReactNode
  fallbackTitle?: string
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Неизвестная ошибка',
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title={this.props.fallbackTitle ?? 'Что-то пошло не так'}
          message={this.state.message}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}
