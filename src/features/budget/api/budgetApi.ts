import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Budget } from '@/entities/budget'
import { apiClient } from '@/shared/api'

export type CreateBudgetInput = {
  categoryId: string
  limit: number
  month: string
}

export type UpdateBudgetInput = {
  id: string
  categoryId: string
  limit: number
  month: string
  spent?: number
}

export const useBudgets = (month?: string) => {
  return useQuery({
    queryKey: ['budgets', month ?? 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<Budget[]>('/budgets', {
        params: month ? { month } : undefined,
      })
      return data
    },
  })
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateBudgetInput): Promise<Budget> => {
      const { data } = await apiClient.post<Budget>('/budgets', input)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useUpdateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateBudgetInput): Promise<Budget> => {
      const { id, ...body } = input
      const { data } = await apiClient.put<Budget>(`/budgets/${id}`, body)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      await apiClient.delete(`/budgets/${id}`)
      return id
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}
