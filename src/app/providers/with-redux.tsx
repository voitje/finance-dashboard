import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { ReactNode } from 'react'
import { authReducer } from '@/features/auth'
import { filtersReducer } from '@/features/transactions'
import { dashboardReducer } from '@/features/dashboard'
import { budgetReducer } from '@/features/budget'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    dashboard: dashboardReducer,
    budget: budgetReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const withRedux = (children: ReactNode) => (
  <Provider store={store}>{children}</Provider>
)
