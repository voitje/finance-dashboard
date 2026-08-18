import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useLogin } from '../api'
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  clearError,
} from '../model'
import { useDispatch } from 'react-redux'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Введите email')
    .email('Введите корректный email'),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(5, 'Минимум 5 символов'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const fieldClassName =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'

export const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const status = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (isAuthenticated && status === 'succeeded') {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, status, navigate])

  const isLoading = status === 'loading' || loginMutation.isPending

  const onSubmit = handleSubmit(async (values) => {
    dispatch(clearError())
    try {
      await loginMutation.mutateAsync(values)
    } catch {
      // error handled in mutation onError → Redux
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Вход</h2>
        <p className="text-sm text-slate-500">
          Введите email и пароль для доступа
        </p>
      </div>

      {authError && (
        <div
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {authError}
        </div>
      )}

      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClassName}
            disabled={isLoading}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Пароль</span>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={fieldClassName}
            disabled={isLoading}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="mt-6 w-full"
        isLoading={isLoading}
      >
        {isLoading ? 'Вход…' : 'Войти'}
      </Button>

      <p className="mt-4 text-center text-xs text-slate-400">
        Демо: <span className="font-medium">test@example.com</span> /{' '}
        <span className="font-medium">admin</span>
      </p>
    </form>
  )
}
