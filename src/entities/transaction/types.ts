export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  amount: number
  categoryId: string
  description: string
  date: string
  type: TransactionType
  createdAt?: string
}
