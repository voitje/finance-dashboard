import {
  memo,
  useCallback,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TableVirtuoso } from 'react-virtuoso'
import type { Transaction } from '@/entities/transaction'
import { CATEGORIES } from '@/entities/category'
import { formatCurrency, formatDate } from '@/shared/lib'
import { Pagination } from '@/shared/ui/Pagination'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useTransactions } from '../api'
import {
  setPage,
  selectSearchQuery,
  selectCategoryId,
  selectTypeFilter,
  selectPage,
  selectPageSize,
} from '../model'

/** Дата | Категория | Описание | Сумма */
const COL_WIDTHS = ['14%', '20%', '36%', '30%'] as const

const cellBase = 'max-w-0 overflow-hidden px-4 py-3'

const COL = {
  date: `${cellBase} whitespace-nowrap`,
  category: cellBase,
  description: cellBase,
  amount: `${cellBase} text-right tabular-nums`,
} as const

const tableFixedClass =
  'w-full table-fixed border-collapse text-left text-sm'

const ColGroup = () => (
  <colgroup>
    {COL_WIDTHS.map((width) => (
      <col key={width} style={{ width }} />
    ))}
  </colgroup>
)

const TransactionRow = memo(function TransactionRow({
  tx,
  categoryName,
}: {
  tx: Transaction
  categoryName: string
}) {
  const amountLabel = `${tx.type === 'income' ? '+' : '−'}${formatCurrency(tx.amount)}`

  return (
    <>
      <td className={`${COL.date} text-slate-600`}>{formatDate(tx.date)}</td>
      <td className={`${COL.category} truncate text-slate-800`} title={categoryName}>
        {categoryName}
      </td>
      <td
        className={`${COL.description} truncate text-slate-800`}
        title={tx.description}
      >
        {tx.description}
      </td>
      <td
        className={[
          COL.amount,
          'truncate font-medium',
          tx.type === 'income' ? 'text-green-600' : 'text-red-600',
        ].join(' ')}
        title={amountLabel}
      >
        {amountLabel}
      </td>
    </>
  )
})

const TableHeader = () => (
  <tr className="bg-slate-50">
    <th className={`${COL.date} font-semibold text-slate-700`}>Дата</th>
    <th className={`${COL.category} font-semibold text-slate-700`}>
      Категория
    </th>
    <th className={`${COL.description} font-semibold text-slate-700`}>
      Описание
    </th>
    <th className={`${COL.amount} font-semibold text-slate-700`}>Сумма</th>
  </tr>
)

const FixedTable = ({
  children,
  ...props
}: ComponentPropsWithoutRef<'table'> & { children?: ReactNode }) => (
  <table {...props} className={tableFixedClass}>
    <ColGroup />
    {children}
  </table>
)

export const TransactionTable = memo(function TransactionTable() {
  const dispatch = useDispatch()
  const searchQuery = useSelector(selectSearchQuery)
  const categoryId = useSelector(selectCategoryId)
  const type = useSelector(selectTypeFilter)
  const page = useSelector(selectPage)
  const pageSize = useSelector(selectPageSize)

  const { data, isLoading, isError, error } = useTransactions({
    type,
    categoryId,
    search: searchQuery.trim() || undefined,
    page,
    pageSize,
  })

  const transactions = useMemo(() => data?.items ?? [], [data?.items])
  const total = data?.total ?? 0

  const categoryNameById = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name])),
    [],
  )

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
    [transactions],
  )

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const useVirtual = sortedTransactions.length > 20

  const handlePageChange = useCallback(
    (nextPage: number) => {
      dispatch(setPage(nextPage))
    },
    [dispatch],
  )

  if (isLoading) {
    return <p className="text-sm text-slate-500">Загрузка транзакций…</p>
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Не удалось загрузить транзакции
        {error instanceof Error ? `: ${error.message}` : ''}
      </p>
    )
  }

  if (sortedTransactions.length === 0) {
    return (
      <EmptyState
        icon="🧾"
        title="Транзакции не найдены"
        description="Измените фильтры или добавьте первую транзакцию"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {useVirtual ? (
          <TableVirtuoso
            style={{ height: 480 }}
            data={sortedTransactions}
            components={{
              Table: FixedTable,
              TableRow: (props) => (
                <tr {...props} className="hover:bg-slate-50" />
              ),
            }}
            fixedHeaderContent={() => <TableHeader />}
            itemContent={(_index, tx) => (
              <TransactionRow
                tx={tx}
                categoryName={categoryNameById[tx.categoryId] ?? tx.categoryId}
              />
            )}
          />
        ) : (
          <FixedTable>
            <thead>
              <TableHeader />
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <TransactionRow
                    tx={tx}
                    categoryName={
                      categoryNameById[tx.categoryId] ?? tx.categoryId
                    }
                  />
                </tr>
              ))}
            </tbody>
          </FixedTable>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Показано {sortedTransactions.length} из {total}
        </p>
        {!useVirtual && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
})
