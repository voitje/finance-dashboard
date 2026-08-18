import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  isLoading?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400',
  secondary:
    'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 disabled:opacity-50',
}

const Spinner = () => (
  <span
    className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    aria-hidden
  />
)

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed',
        variantClass[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  )
}

export default Button
