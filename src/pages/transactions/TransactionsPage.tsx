import { useState } from 'react'
import {
  TransactionFilters,
  TransactionTable,
  TransactionForm,
} from '@/features/transactions'
import { Button } from '@/shared/ui/Button'
import Modal from '@/shared/ui/Modal'

export const TransactionsPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Транзакции</h1>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Добавить транзакцию
        </Button>
      </div>

      <TransactionFilters />
      <TransactionTable />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Новая транзакция"
      >
        <TransactionForm onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  )
}
