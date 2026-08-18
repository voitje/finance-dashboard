import type { ButtonHTMLAttributes } from 'react'
import { Button } from '@/shared/ui/Button'

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

/** Presentational logout control — wire onClick from app/features */
export const LogoutButton = ({
  isLoading = false,
  className = '',
  children = 'Выйти',
  ...props
}: LogoutButtonProps) => {
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={isLoading || props.disabled}
      className={className}
      {...props}
    >
      {isLoading ? 'Выход…' : children}
    </Button>
  )
}

export default LogoutButton
