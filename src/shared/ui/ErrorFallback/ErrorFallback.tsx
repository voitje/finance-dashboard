import { Button } from '@/shared/ui/Button'

interface ErrorFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorFallback = ({
  title = 'Что-то пошло не так',
  message = 'Произошла непредвиденная ошибка. Попробуйте ещё раз.',
  onRetry,
}: ErrorFallbackProps) => {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/60 px-6 py-10 text-center">
      <div className="mb-3 text-3xl" aria-hidden>
        ⚠️
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{message}</p>
      {onRetry && (
        <Button className="mt-5" variant="primary" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </div>
  )
}

export default ErrorFallback
