import { memo, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/shared/lib'
import type { CategoryExpense } from '../api'

interface CategoryPieChartProps {
  data?: CategoryExpense[]
  isLoading?: boolean
}

type PieTooltipProps = {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    payload?: CategoryExpense
  }>
}

const CustomTooltip = ({ active, payload }: PieTooltipProps) => {
  if (!active || !payload?.length) return null

  const item = payload[0]
  const name = item.payload?.name ?? item.name ?? ''
  const amount = item.value ?? 0

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-slate-800">{name}</p>
      <p className="text-slate-600">{formatCurrency(amount)}</p>
    </div>
  )
}

export const CategoryPieChart = memo(function CategoryPieChart({
  data = [],
  isLoading = false,
}: CategoryPieChartProps) {
  const chartData = useMemo(
    () =>
      [...data]
        .filter((item) => item.amount > 0)
        .sort((a, b) => b.amount - a.amount),
    [data],
  )

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="h-40 w-40 animate-pulse rounded-full bg-slate-100" />
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        Нет данных
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Расходы по категориям
      </h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.categoryId} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-slate-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})
