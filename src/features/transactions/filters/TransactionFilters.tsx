import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CATEGORIES } from '@/entities/category'
import type { TransactionType } from '@/entities/transaction'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import {
  setSearchQuery,
  setCategoryFilter,
  setTypeFilter,
  setPage,
  selectSearchQuery,
  selectCategoryId,
  selectTypeFilter,
} from '../model'

const TYPE_OPTIONS: { label: string; value: TransactionType | null }[] = [
  { label: 'Все', value: null },
  { label: 'Доход', value: 'income' },
  { label: 'Расход', value: 'expense' },
]

const inputClassName =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'

const typeButtonClass = (active: boolean) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    active
      ? 'bg-slate-900 text-white'
      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ].join(' ')

export const TransactionFilters = () => {
  const dispatch = useDispatch()
  const searchQuery = useSelector(selectSearchQuery)
  const categoryId = useSelector(selectCategoryId)
  const type = useSelector(selectTypeFilter)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch === searchQuery) return
      dispatch(setSearchQuery(localSearch))
      dispatch(setPage(1))
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, searchQuery, dispatch])

  const categoryOptions = useMemo(() => CATEGORIES, [])

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(event.target.value)
  }, [])

  const handleCategoryChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value
      dispatch(setCategoryFilter(value === '' ? null : value))
      dispatch(setPage(1))
    },
    [dispatch],
  )

  const handleTypeChange = useCallback(
    (value: TransactionType | null) => {
      dispatch(setTypeFilter(value))
      dispatch(setPage(1))
    },
    [dispatch],
  )

  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
      <label className="flex min-w-56 flex-1 flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Поиск</span>
        <Input
          type="search"
          value={localSearch}
          onChange={handleSearchChange}
          placeholder="Поиск по описанию…"
          className={inputClassName}
        />
      </label>

      <label className="flex min-w-48 flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Категория</span>
        <Select
          value={categoryId ?? ''}
          onChange={handleCategoryChange}
          className={inputClassName}
        >
          <option value="">Все категории</option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Тип</span>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              className={typeButtonClass(type === option.value)}
              onClick={() => handleTypeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
