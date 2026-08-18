import { createSlice } from '@reduxjs/toolkit'

interface DashboardState {
  period: 'week' | 'month' | 'year'
}

const initialState: DashboardState = {
  period: 'month',
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPeriod: (state, action: { payload: DashboardState['period'] }) => {
      state.period = action.payload
    },
  },
})

export const { setPeriod } = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
