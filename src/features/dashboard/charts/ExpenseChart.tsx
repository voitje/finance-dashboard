import { memo, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CATEGORIES } from '@/entities/category'
import { formatCurrency } from '@/shared/lib'
import type { MonthlyExpensesRow } from '../api'

interface ExpenseChartProps {
  data?: MonthlyExpensesRow[]
  isLoading?: boolean
}

type BarTooltipProps = {
  active?: boolean
  label?: string
  payload?: Array<{
    name?: string
    value?: number
    color?: string
  }>
}

const CustomTooltip = ({ active, label, payload }: BarTooltipProps) => {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-medium text-slate-800">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2 text-slate-600">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span>
            {entry.name}: {formatCurrency(entry.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  )
}

const formatYAxis = (value: number) => {
  if (value >= 1000) return `${Math.round(value / 1000)}к ₽`
  return `${value} ₽`
}

export const ExpenseChart = memo(function ExpenseChart({
  data = [],
  isLoading = false,
}: ExpenseChartProps) {
  const categories = useMemo(
    () => CATEGORIES.filter((category) => category.type === 'expense'),
    [],
  )

  const chartData = useMemo(() => data, [data])

  const hasValues = useMemo(
    () =>
      chartData.some((row) =>
        categories.some((category) => Number(row[category.id] ?? 0) > 0),
      ),
    [chartData, categories],
  )

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="h-48 w-full max-w-md animate-pulse rounded-lg bg-slate-100" />
      </div>
    )
  }

  if (!hasValues) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        Нет данных
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Расходы за 6 месяцев
      </h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="monthLabel"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-slate-700">{value}</span>
              )}
            />
            {categories.map((category) => (
              <Bar
                key={category.id}
                dataKey={category.id}
                name={category.name}
                stackId="expenses"
                fill={category.color}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})
