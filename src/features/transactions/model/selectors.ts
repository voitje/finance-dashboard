import type { FiltersState } from './filtersSlice'

export const selectSearchQuery = (state: { filters: FiltersState }) =>
  state.filters.searchQuery

export const selectCategoryId = (state: { filters: FiltersState }) =>
  state.filters.categoryId

export const selectTypeFilter = (state: { filters: FiltersState }) =>
  state.filters.type

export const selectPage = (state: { filters: FiltersState }) => state.filters.page

export const selectPageSize = (state: { filters: FiltersState }) =>
  state.filters.pageSize
