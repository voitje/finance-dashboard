import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Transaction, TransactionType } from '@/entities/transaction'
import { apiClient } from '@/shared/api'

export type CreateTransactionInput = {
  amount: number
  type: TransactionType
  categoryId: string
  date: string
  description?: string
}

export type TransactionsQueryParams = {
  type?: TransactionType | null
  categoryId?: string | null
  search?: string
  page?: number
  pageSize?: number
}

export type TransactionsPage = {
  items: Transaction[]
  total: number
}

const TRANSACTIONS_QUERY_KEY = ['transactions'] as const

export const fetchTransactions = async (
  params: TransactionsQueryParams = {},
): Promise<TransactionsPage> => {
  const response = await apiClient.get<Transaction[]>('/transactions', {
    params: {
      type: params.type || undefined,
      categoryId: params.categoryId || undefined,
      search: params.search || undefined,
      _page: params.page ?? 1,
      _limit: params.pageSize ?? 10,
    },
  })

  const total = Number(response.headers['x-total-count'] ?? response.data.length)

  return {
    items: response.data,
    total,
  }
}

export const useTransactions = (params: TransactionsQueryParams = {}) => {
  return useQuery({
    queryKey: [
      ...TRANSACTIONS_QUERY_KEY,
      params.type ?? null,
      params.categoryId ?? null,
      params.search ?? '',
      params.page ?? 1,
      params.pageSize ?? 10,
    ],
    queryFn: () => fetchTransactions(params),
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTransactionInput): Promise<Transaction> => {
      const { data } = await apiClient.post<Transaction>('/transactions', input)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/transactions/${id}`)
      return id
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const transactionsApi = {
  getAll: (params?: TransactionsQueryParams) => fetchTransactions(params),
  create: (input: CreateTransactionInput) =>
    apiClient.post<Transaction>('/transactions', input).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/transactions/${id}`),
}
