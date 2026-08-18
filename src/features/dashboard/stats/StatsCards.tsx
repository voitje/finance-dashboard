import { motion } from 'framer-motion'
import { formatCurrency } from '@/shared/lib'
import { EmptyState } from '@/shared/ui/EmptyState'
import type { DashboardStats } from '../api'

export type BudgetSummary = {
  totalLimit: number
  totalSpent: number
}

interface StatsCardsProps {
  data?: DashboardStats
  budgetSummary?: BudgetSummary | null
  isLoading?: boolean
}

const cards = [
  {
    key: 'balance' as const,
    label: 'Баланс',
    emoji: '💰',
    bg: 'bg-sky-50',
    valueClass: 'text-sky-800',
  },
  {
    key: 'income' as const,
    label: 'Доходы за месяц',
    emoji: '📈',
    bg: 'bg-emerald-50',
    valueClass: 'text-emerald-700',
  },
  {
    key: 'expenses' as const,
    label: 'Расходы за месяц',
    emoji: '📉',
    bg: 'bg-rose-50',
    valueClass: 'text-rose-700',
  },
  {
    key: 'topCategory' as const,
    label: 'Топ-категория',
    emoji: '🏷️',
    bg: 'bg-amber-50',
    valueClass: 'text-amber-800',
  },
  {
    key: 'budget' as const,
    label: 'Бюджет на месяц',
    emoji: '🎯',
    bg: 'bg-violet-50',
    valueClass: 'text-violet-800',
  },
]

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-5">
    <div className="mb-3 h-6 w-6 rounded bg-slate-200" />
    <div className="mb-2 h-4 w-24 rounded bg-slate-200" />
    <div className="h-7 w-32 rounded bg-slate-200" />
  </div>
)

const getCardValue = (
  data: DashboardStats,
  key: (typeof cards)[number]['key'],
  budgetSummary?: BudgetSummary | null,
) => {
  if (key === 'topCategory') {
    if (!data.topCategory) return '—'
    return data.topCategory.name
  }
  if (key === 'budget') {
    if (!budgetSummary || budgetSummary.totalLimit === 0) return 'Не задан'
    return `${formatCurrency(budgetSummary.totalSpent)} / ${formatCurrency(budgetSummary.totalLimit)}`
  }
  return formatCurrency(data[key])
}

const getCardSubValue = (
  data: DashboardStats,
  key: (typeof cards)[number]['key'],
  budgetSummary?: BudgetSummary | null,
) => {
  if (key === 'topCategory' && data.topCategory) {
    return formatCurrency(data.topCategory.amount)
  }
  if (key === 'budget' && budgetSummary && budgetSummary.totalLimit > 0) {
    const percent = Math.round(
      (budgetSummary.totalSpent / budgetSummary.totalLimit) * 100,
    )
    return `${percent}% использовано`
  }
  return null
}

export const StatsCards = ({
  data,
  budgetSummary = null,
  isLoading = false,
}: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <SkeletonCard key={card.key} />
        ))}
      </div>
    )
  }

  if (!data || !data.hasData) {
    return (
      <EmptyState
        icon="🚀"
        title="Пока нет данных"
        description="Добавьте первые транзакции, чтобы увидеть статистику дашборда"
      />
    )
  }

  const budgetExceeded =
    Boolean(budgetSummary) &&
    budgetSummary!.totalLimit > 0 &&
    budgetSummary!.totalSpent > budgetSummary!.totalLimit

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card, index) => {
        const subValue = getCardSubValue(data, card.key, budgetSummary)
        const isBudgetCard = card.key === 'budget'

        return (
          <motion.article
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.06 }}
            className={[
              'rounded-xl border p-5 shadow-sm',
              isBudgetCard && budgetExceeded
                ? 'border-red-400 bg-red-50'
                : `border-slate-100 ${card.bg}`,
            ].join(' ')}
          >
            <div className="mb-3 flex items-center gap-2 text-2xl" aria-hidden>
              <span>{card.emoji}</span>
              {isBudgetCard && budgetExceeded && (
                <span title="Превышен">⚠️</span>
              )}
            </div>
            <p className="mb-1 text-sm font-medium text-slate-600">
              {card.label}
            </p>
            <p
              className={[
                'text-xl font-semibold tracking-tight',
                isBudgetCard && budgetExceeded
                  ? 'text-red-700'
                  : card.valueClass,
              ].join(' ')}
            >
              {getCardValue(data, card.key, budgetSummary)}
            </p>
            {subValue && (
              <p
                className={[
                  'mt-1 text-sm',
                  isBudgetCard && budgetExceeded
                    ? 'text-red-600'
                    : 'text-slate-500',
                ].join(' ')}
              >
                {subValue}
              </p>
            )}
          </motion.article>
        )
      })}
    </div>
  )
}
