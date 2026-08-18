import { useMemo } from 'react'
import {
  StatsCards,
  ExpenseChart,
  CategoryPieChart,
  useDashboardStats,
  useMonthlyExpenses,
} from '@/features/dashboard'
import { useBudgets } from '@/features/budget'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { Button } from '@/shared/ui/Button'

const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const DashboardPage = () => {
  const currentMonth = getCurrentMonth()

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats()

  const {
    data: monthlyExpenses,
    isLoading: isMonthlyLoading,
    isError: isMonthlyError,
    error: monthlyError,
    refetch: refetchMonthly,
  } = useMonthlyExpenses()

  const {
    data: budgets = [],
    isLoading: isBudgetsLoading,
    isError: isBudgetsError,
    error: budgetsError,
    refetch: refetchBudgets,
  } = useBudgets(currentMonth)

  const budgetSummary = useMemo(() => {
    const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0)
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
    return { totalLimit, totalSpent }
  }, [budgets])

  const isLoading = isStatsLoading || isMonthlyLoading || isBudgetsLoading
  const isError = isStatsError || isMonthlyError || isBudgetsError
  const error = statsError ?? monthlyError ?? budgetsError

  const handleRetry = () => {
    void refetchStats()
    void refetchMonthly()
    void refetchBudgets()
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-8">
        <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
          <p className="mb-3 text-sm text-red-700">
            Не удалось загрузить данные дашборда
            {error instanceof Error ? `: ${error.message}` : ''}
          </p>
          <Button variant="primary" onClick={handleRetry}>
            Повторить
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>

      <StatsCards
        data={stats}
        budgetSummary={budgetSummary}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ErrorBoundary fallbackTitle="Ошибка графика расходов">
          <ExpenseChart data={monthlyExpenses} isLoading={isLoading} />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Ошибка круговой диаграммы">
          <CategoryPieChart
            data={stats?.expensesByCategory}
            isLoading={isLoading}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}
