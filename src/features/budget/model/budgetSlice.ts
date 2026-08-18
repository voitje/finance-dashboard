import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Budget } from '@/entities/budget'

export interface BudgetState {
  budgets: Budget[]
  isEditing: boolean
  editingBudgetId: string | null
}

const initialState: BudgetState = {
  budgets: [],
  isEditing: false,
  editingBudgetId: null,
}

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload)
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.budgets[index] = action.payload
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter((item) => item.id !== action.payload)
      if (state.editingBudgetId === action.payload) {
        state.isEditing = false
        state.editingBudgetId = null
      }
    },
    startEditing: (state, action: PayloadAction<string>) => {
      state.isEditing = true
      state.editingBudgetId = action.payload
    },
    stopEditing: (state) => {
      state.isEditing = false
      state.editingBudgetId = null
    },
  },
})

export const {
  setBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  startEditing,
  stopEditing,
} = budgetSlice.actions

export const budgetReducer = budgetSlice.reducer
