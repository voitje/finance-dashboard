import type { Budget } from '@/entities/budget'
import type { BudgetState } from './budgetSlice'

type StateWithBudget = { budget: BudgetState }

export const selectBudgets = (state: StateWithBudget) => state.budget.budgets

export const selectBudgetByCategory =
  (categoryId: string, month?: string) => (state: StateWithBudget) =>
    state.budget.budgets.find(
      (budget) =>
        budget.categoryId === categoryId &&
        (month === undefined || budget.month === month),
    ) ?? null

export const selectBudgetsByMonth = (month: string) => (state: StateWithBudget) =>
  state.budget.budgets.filter((budget) => budget.month === month)

export const selectTotalBudget =
  (month?: string) => (state: StateWithBudget) =>
    state.budget.budgets
      .filter((budget) => month === undefined || budget.month === month)
      .reduce((sum, budget) => sum + budget.limit, 0)

export const selectTotalSpent =
  (month?: string) => (state: StateWithBudget) =>
    state.budget.budgets
      .filter((budget) => month === undefined || budget.month === month)
      .reduce((sum, budget) => sum + budget.spent, 0)

export const selectIsEditing = (state: StateWithBudget) => state.budget.isEditing

export const selectEditingBudgetId = (state: StateWithBudget) =>
  state.budget.editingBudgetId

export const selectEditingBudget = (state: StateWithBudget): Budget | null => {
  if (!state.budget.editingBudgetId) return null
  return (
    state.budget.budgets.find((budget) => budget.id === state.budget.editingBudgetId) ??
    null
  )
}
