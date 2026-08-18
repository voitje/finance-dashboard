import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CATEGORIES } from '@/entities/category'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { useCreateTransaction } from '../api'

const transactionFormSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Введите сумму' })
    .positive('Сумма должна быть больше 0'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Выберите тип',
  }),
  categoryId: z.string().min(1, 'Выберите категорию'),
  date: z.string().min(1, 'Укажите дату'),
  description: z
    .string()
    .max(200, 'Максимум 200 символов')
    .optional()
    .or(z.literal('')),
})

type TransactionFormValues = z.infer<typeof transactionFormSchema>

interface TransactionFormProps {
  onClose: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

const fieldClassName =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'

const typeButtonClass = (active: boolean) =>
  [
    'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    active
      ? 'bg-slate-900 text-white'
      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ].join(' ')

const TransactionForm = ({ onClose }: TransactionFormProps) => {
  const createTransaction = useCreateTransaction()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: undefined,
      type: 'expense',
      categoryId: '',
      date: today(),
      description: '',
    },
  })

  const selectedType = watch('type')
  const selectedCategoryId = watch('categoryId')

  const filteredCategories = useMemo(
    () => CATEGORIES.filter((category) => category.type === selectedType),
    [selectedType],
  )

  useEffect(() => {
    const stillValid = filteredCategories.some((c) => c.id === selectedCategoryId)
    if (!stillValid) {
      setValue('categoryId', '')
    }
  }, [filteredCategories, selectedCategoryId, setValue])

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createTransaction.mutateAsync({
        amount: values.amount,
        type: values.type,
        categoryId: values.categoryId,
        date: values.date,
        description: values.description || undefined,
      })
      onClose()
    } catch (error) {
      console.error('Не удалось создать транзакцию', error)
    }
  })

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium text-slate-700">Тип</legend>
        <div className="flex gap-2">
          <button
            type="button"
            className={typeButtonClass(selectedType === 'income')}
            onClick={() => setValue('type', 'income', { shouldValidate: true })}
          >
            Доход
          </button>
          <button
            type="button"
            className={typeButtonClass(selectedType === 'expense')}
            onClick={() => setValue('type', 'expense', { shouldValidate: true })}
          >
            Расход
          </button>
        </div>
        <input type="hidden" {...register('type')} />
        {errors.type && (
          <p className="text-sm text-red-600">{errors.type.message}</p>
        )}
      </fieldset>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Категория</span>
        <Select className={fieldClassName} {...register('categoryId')}>
          <option value="">Выберите категорию</option>
          {filteredCategories.map((category) => (
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
        <span className="text-sm font-medium text-slate-700">Сумма</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={fieldClassName}
          {...register('amount')}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Дата</span>
        <Input type="date" className={fieldClassName} {...register('date')} />
        {errors.date && (
          <p className="text-sm text-red-600">{errors.date.message}</p>
        )}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">
          Описание <span className="font-normal text-slate-400">(необязательно)</span>
        </span>
        <textarea
          rows={3}
          maxLength={200}
          placeholder="Краткое описание"
          className={`${fieldClassName} resize-y`}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={createTransaction.isPending}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={createTransaction.isPending}
        >
          {createTransaction.isPending ? 'Сохранение…' : 'Добавить'}
        </Button>
      </div>
    </motion.form>
  )
}

export default TransactionForm
