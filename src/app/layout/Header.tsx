import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectCurrentUser,
  useLogout,
} from '@/features/auth'
import { LogoutButton } from '@/shared/ui/LogoutButton'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export const Header = () => {
  const user = useSelector(selectCurrentUser)
  const logoutMutation = useLogout()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      navigate('/login', { replace: true })
    } catch {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-8 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold tracking-tight text-slate-900">
            Finance Dashboard
          </span>
          <nav className="flex flex-wrap gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              Дашборд
            </NavLink>
            <NavLink to="/transactions" className={navLinkClass}>
              Транзакции
            </NavLink>
            <NavLink to="/budget" className={navLinkClass}>
              Бюджет
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {user.name}
          </span>
          <LogoutButton
            isLoading={logoutMutation.isPending}
            onClick={() => void handleLogout()}
          />
        </div>
      </div>
    </header>
  )
}
