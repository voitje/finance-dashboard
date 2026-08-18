import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CATEGORIES } from '@/entities/category'
import type { Budget } from '@/entities/budget'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { useCreateBudget, useUpdateBudget } from '../api'

const budgetFormSchema = z.object({
  categoryId: z.string().min(1, 'Выберите категорию'),
  limit: z.coerce
    .number({ invalid_type_error: 'Введите лимит' })
    .positive('Лимит должен быть больше 0'),
  month: z.string().min(1, 'Укажите месяц'),
})

type BudgetFormValues = z.infer<typeof budgetFormSchema>

interface BudgetFormProps {
  onClose: () => void
  budget?: Budget | null
  defaultCategoryId?: string | null
  defaultMonth: string
}

const fieldClassName =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'

const expenseCategories = CATEGORIES.filter((category) => category.type === 'expense')

export const BudgetForm = ({
  onClose,
  budget = null,
  defaultCategoryId = null,
  defaultMonth,
}: BudgetFormProps) => {
  const createBudget = useCreateBudget()
  const updateBudgetMutation = useUpdateBudget()
  const isEditing = Boolean(budget)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: budget?.categoryId ?? defaultCategoryId ?? '',
      limit: budget?.limit,
      month: budget?.month ?? defaultMonth,
    },
  })

  const isPending = createBudget.isPending || updateBudgetMutation.isPending

  const availableCategories = useMemo(() => expenseCategories, [])

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (budget) {
        await updateBudgetMutation.mutateAsync({
          id: budget.id,
          categoryId: values.categoryId,
          limit: values.limit,
          month: values.month,
          spent: budget.spent,
        })
      } else {
        await createBudget.mutateAsync({
          categoryId: values.categoryId,
          limit: values.limit,
          month: values.month,
        })
      }
      onClose()
    } catch (error) {
      console.error('Не удалось сохранить бюджет', error)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Категория</span>
        <Select className={fieldClassName} {...register('categoryId')}>
          <option value="">Выберите категорию</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Лимит (₽)</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={fieldClassName}
          {...register('limit')}
        />
        {errors.limit && (
          <p className="text-sm text-red-600">{errors.limit.message}</p>
        )}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Месяц</span>
        <Input type="month" className={fieldClassName} {...register('month')} />
        {errors.month && (
          <p className="text-sm text-red-600">{errors.month.message}</p>
        )}
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isPending}
        >
          Отмена
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Сохранение…' : isEditing ? 'Сохранить' : 'Установить'}
        </Button>
      </div>
    </form>
  )
}
