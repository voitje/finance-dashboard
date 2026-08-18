import { motion } from 'framer-motion'
import { CATEGORIES } from '@/entities/category'
import type { Budget } from '@/entities/budget'
import { formatCurrency } from '@/shared/lib'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useDeleteBudget } from '../api'

interface BudgetProgressProps {
  budgets: Budget[]
  month: string
  isLoading?: boolean
  onAdd: (categoryId?: string) => void
  onEdit: (budget: Budget) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  cat1: '🛒',
  cat2: '🚗',
  cat3: '🎬',
  cat4: '💊',
  cat5: '☕',
  cat6: '💰',
  cat7: '💻',
  cat8: '📈',
}

const expenseCategories = CATEGORIES.filter((category) => category.type === 'expense')

const getProgressTone = (ratio: number) => {
  if (ratio > 1) {
    return {
      bar: 'bg-red-500',
      track: 'bg-red-100',
      text: 'text-red-700',
    }
  }
  if (ratio >= 0.8) {
    return {
      bar: 'bg-amber-400',
      track: 'bg-amber-100',
      text: 'text-amber-700',
    }
  }
  return {
    bar: 'bg-emerald-500',
    track: 'bg-emerald-100',
    text: 'text-emerald-700',
  }
}

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-5">
    <div className="mb-4 h-5 w-32 rounded bg-slate-200" />
    <div className="mb-3 h-3 w-full rounded-full bg-slate-200" />
    <div className="h-4 w-40 rounded bg-slate-200" />
  </div>
)

export const BudgetProgress = ({
  budgets,
  isLoading = false,
  onAdd,
  onEdit,
}: BudgetProgressProps) => {
  const deleteBudget = useDeleteBudget()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (expenseCategories.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="Бюджеты не установлены"
        description="Добавьте лимиты по категориям расходов"
        actionLabel="Добавить лимит"
        onAction={() => onAdd()}
      />
    )
  }

  const budgetsByCategory = new Map(
    budgets.map((budget) => [budget.categoryId, budget]),
  )
  const hasAnyBudget = budgets.length > 0

  return (
    <div className="space-y-4">
      {!hasAnyBudget && (
        <EmptyState
          icon="📊"
          title="Бюджеты не установлены"
          description="Создайте первый лимит, чтобы контролировать расходы"
          actionLabel="Создать первый бюджет"
          onAction={() => onAdd()}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expenseCategories.map((category) => {
          const budget = budgetsByCategory.get(category.id)

          if (!budget) {
            return (
              <article
                key={category.id}
                className="flex flex-col items-start justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-5 transition hover:border-slate-400"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {category.icon ?? CATEGORY_ICONS[category.id] ?? '📁'}
                  </span>
                  <h3 className="font-medium text-slate-800">{category.name}</h3>
                </div>
                <p className="mb-4 text-sm text-slate-500">Лимит ещё не задан</p>
                <Button variant="secondary" onClick={() => onAdd(category.id)}>
                  Установить лимит
                </Button>
              </article>
            )
          }

          const ratio = budget.limit > 0 ? budget.spent / budget.limit : 0
          const percent = Math.round(ratio * 100)
          const tone = getProgressTone(ratio)
          const width = `${Math.min(ratio * 100, 100)}%`

          return (
            <article
              key={budget.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {category.icon ?? CATEGORY_ICONS[category.id] ?? '📁'}
                  </span>
                  <h3 className="font-medium text-slate-800">{category.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Редактировать"
                    onClick={() => onEdit(budget)}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Удалить"
                    disabled={deleteBudget.isPending}
                    onClick={() => {
                      if (window.confirm('Удалить лимит для этой категории?')) {
                        void deleteBudget.mutateAsync(budget.id)
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-600">
                  Потрачено {formatCurrency(budget.spent)} из{' '}
                  {formatCurrency(budget.limit)}
                </p>
                <span className={`text-sm font-semibold ${tone.text}`}>
                  {percent}%
                </span>
              </div>

              <div className={`h-2.5 overflow-hidden rounded-full ${tone.track}`}>
                <motion.div
                  className={`h-full rounded-full ${tone.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              {ratio > 1 && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  Лимит превышен на {formatCurrency(budget.spent - budget.limit)}
                </p>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
