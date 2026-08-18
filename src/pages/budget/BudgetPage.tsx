import { useState } from 'react'
import {
  BudgetProgress,
  BudgetForm,
  useBudgets,
  startEditing,
  stopEditing,
} from '@/features/budget'
import type { Budget } from '@/entities/budget'
import { Button } from '@/shared/ui/Button'
import Modal from '@/shared/ui/Modal'
import { useDispatch } from 'react-redux'

const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const BudgetPage = () => {
  const dispatch = useDispatch()
  const [month, setMonth] = useState(getCurrentMonth)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | null>(null)

  const { data: budgets = [], isLoading, isError, error, refetch } = useBudgets(month)

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingBudget(null)
    setDefaultCategoryId(null)
    dispatch(stopEditing())
  }

  const openCreate = (categoryId?: string) => {
    setEditingBudget(null)
    setDefaultCategoryId(categoryId ?? null)
    setIsFormOpen(true)
  }

  const openEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setDefaultCategoryId(null)
    dispatch(startEditing(budget.id))
    setIsFormOpen(true)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Бюджет и лимиты</h1>
          <p className="mt-1 text-sm text-slate-500">
            Следите за расходами по категориям
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Месяц</span>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <Button variant="primary" onClick={() => openCreate()}>
            Добавить лимит
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
          <p className="mb-3 text-sm text-red-700">
            Не удалось загрузить бюджеты
            {error instanceof Error ? `: ${error.message}` : ''}
          </p>
          <Button variant="primary" onClick={() => void refetch()}>
            Повторить
          </Button>
        </div>
      ) : (
        <BudgetProgress
          budgets={budgets}
          month={month}
          isLoading={isLoading}
          onAdd={openCreate}
          onEdit={openEdit}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingBudget ? 'Редактировать лимит' : 'Новый лимит'}
        size="sm"
      >
        <BudgetForm
          key={editingBudget?.id ?? defaultCategoryId ?? 'new'}
          onClose={closeForm}
          budget={editingBudget}
          defaultCategoryId={defaultCategoryId}
          defaultMonth={month}
        />
      </Modal>
    </div>
  )
}
