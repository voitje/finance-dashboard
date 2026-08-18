import { useQuery } from '@tanstack/react-query'
import type { Category } from '@/entities/category'
import type { Budget } from '@/entities/budget'
import { apiClient } from '@/shared/api'

export type CategoryExpense = {
  categoryId: string
  name: string
  color: string
  amount: number
}

export type DashboardStats = {
  balance: number
  income: number
  expenses: number
  topCategory: CategoryExpense | null
  expensesByCategory: CategoryExpense[]
  monthlyData: MonthlyExpensesRow[]
  hasData: boolean
}

export type MonthlyExpensesRow = {
  monthKey: string
  monthLabel: string
} & Record<string, string | number>

type DashboardStatsResponse = {
  totalIncome: number
  totalExpenses: number
  balance: number
  topCategory: CategoryExpense | null
  expensesByCategory: CategoryExpense[]
  monthlyData: MonthlyExpensesRow[]
  hasData: boolean
}

const mapStats = (data: DashboardStatsResponse): DashboardStats => ({
  balance: data.balance,
  income: data.totalIncome,
  expenses: data.totalExpenses,
  topCategory: data.topCategory,
  expensesByCategory: data.expensesByCategory,
  monthlyData: data.monthlyData,
  hasData: data.hasData,
})

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStatsResponse>(
        '/dashboard/stats',
      )
      return mapStats(data)
    },
  })
}

export const useMonthlyExpenses = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStatsResponse>(
        '/dashboard/stats',
      )
      return mapStats(data)
    },
    select: (data) => data.monthlyData,
  })
}

export const useCategories = (type?: Category['type']) => {
  return useQuery({
    queryKey: ['categories', type ?? 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>('/categories', {
        params: type ? { type } : undefined,
      })
      return data
    },
  })
}

export const useBudget = (month: string) => {
  return useQuery({
    queryKey: ['budgets', month],
    queryFn: async () => {
      const { data } = await apiClient.get<Budget[]>('/budgets', {
        params: { month },
      })
      return data
    },
    enabled: Boolean(month),
  })
}
