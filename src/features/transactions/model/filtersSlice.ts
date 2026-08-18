import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TransactionType } from '@/entities/transaction'

export interface FiltersState {
  searchQuery: string
  categoryId: string | null
  type: TransactionType | null
  page: number
  pageSize: number
}

const initialState: FiltersState = {
  searchQuery: '',
  categoryId: null,
  type: null,
  page: 1,
  pageSize: 25,
}

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.categoryId = action.payload
    },
    setTypeFilter: (state, action: PayloadAction<TransactionType | null>) => {
      state.type = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    resetFilters: () => initialState,
  },
})

export const {
  setSearchQuery,
  setCategoryFilter,
  setTypeFilter,
  setPage,
  resetFilters,
} = filtersSlice.actions

export const filtersReducer = filtersSlice.reducer
