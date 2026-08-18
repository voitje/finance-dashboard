import { http, HttpResponse, delay } from 'msw'
import type { Transaction, TransactionType } from '@/entities/transaction'
import type { Budget } from '@/entities/budget'
import type { Category } from '@/entities/category'
import {
  users,
  categories,
  transactions,
  budgets,
  setTransactions,
  setBudgets,
  VALID_TOKEN_PREFIX,
} from './data'

const MONTH_LABELS = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
] as const

const getBearerToken = (request: Request) => {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

const isValidToken = (token: string | null) =>
  Boolean(token && token.startsWith(VALID_TOKEN_PREFIX))

const calcSpentForBudget = (budget: Budget) =>
  transactions
    .filter(
      (tx) =>
        tx.type === 'expense' &&
        tx.categoryId === budget.categoryId &&
        tx.date.startsWith(budget.month),
    )
    .reduce((sum, tx) => sum + tx.amount, 0)

const withSpent = (items: Budget[]): Budget[] =>
  items.map((budget) => ({
    ...budget,
    spent: calcSpentForBudget(budget),
  }))

const getMonthKeys = (count: number, from = new Date()) => {
  const keys: {
    year: number
    month: number
    monthKey: string
    monthLabel: string
  }[] = []

  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(from.getFullYear(), from.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = date.getMonth()
    keys.push({
      year,
      month,
      monthKey: `${year}-${String(month + 1).padStart(2, '0')}`,
      monthLabel: MONTH_LABELS[month],
    })
  }

  return keys
}

export const handlers = [
  // Auth
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === body.email?.toLowerCase() &&
        item.password === body.password,
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'Неверный email или пароль' },
        { status: 401 },
      )
    }

    const { password: _password, ...safeUser } = user
    return HttpResponse.json({
      user: safeUser,
      token: `${VALID_TOKEN_PREFIX}${user.id}`,
    })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(200)
    const token = getBearerToken(request)

    if (!isValidToken(token)) {
      return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    }

    const user = users[0]
    const { password: _password, ...safeUser } = user
    return HttpResponse.json(safeUser)
  }),

  // Transactions
  http.get('/api/transactions', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as TransactionType | null
    const categoryId = url.searchParams.get('categoryId')
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const page = Math.max(1, Number(url.searchParams.get('_page') ?? 1))
    const limit = Math.max(1, Number(url.searchParams.get('_limit') ?? 10))

    let filtered = [...transactions]

    if (type === 'income' || type === 'expense') {
      filtered = filtered.filter((tx) => tx.type === type)
    }
    if (categoryId) {
      filtered = filtered.filter((tx) => tx.categoryId === categoryId)
    }
    if (search) {
      filtered = filtered.filter((tx) =>
        tx.description.toLowerCase().includes(search),
      )
    }

    const total = filtered.length
    const start = (page - 1) * limit
    const items = filtered.slice(start, start + limit)

    return HttpResponse.json(items, {
      headers: {
        'X-Total-Count': String(total),
      },
    })
  }),

  http.post('/api/transactions', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as Partial<Transaction>

    if (
      !body.amount ||
      body.amount <= 0 ||
      !body.type ||
      !body.categoryId ||
      !body.date
    ) {
      return HttpResponse.json(
        { message: 'Некорректные данные транзакции' },
        { status: 400 },
      )
    }

    const created: Transaction = {
      id: `tx-${Date.now()}`,
      amount: body.amount,
      type: body.type,
      categoryId: body.categoryId,
      date: body.date,
      description: body.description?.trim() ?? '',
      createdAt: new Date().toISOString(),
    }

    setTransactions([created, ...transactions])
    return HttpResponse.json(created, { status: 201 })
  }),

  http.get('/api/transactions/:id', async ({ params }) => {
    await delay(200)
    const tx = transactions.find((item) => item.id === params.id)
    if (!tx) {
      return HttpResponse.json(
        { message: 'Транзакция не найдена' },
        { status: 404 },
      )
    }
    return HttpResponse.json(tx)
  }),

  http.delete('/api/transactions/:id', async ({ params }) => {
    await delay(250)
    const exists = transactions.some((item) => item.id === params.id)
    if (!exists) {
      return HttpResponse.json(
        { message: 'Транзакция не найдена' },
        { status: 404 },
      )
    }
    setTransactions(transactions.filter((item) => item.id !== params.id))
    return HttpResponse.json({ success: true }, { status: 200 })
  }),

  // Categories
  http.get('/api/categories', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as Category['type'] | null

    const result =
      type === 'income' || type === 'expense'
        ? categories.filter((category) => category.type === type)
        : categories

    return HttpResponse.json(result)
  }),

  // Budgets
  http.get('/api/budgets', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const month = url.searchParams.get('month')

    const filtered = month
      ? budgets.filter((budget) => budget.month === month)
      : budgets

    return HttpResponse.json(withSpent(filtered))
  }),

  http.post('/api/budgets', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as Partial<Budget>

    if (!body.categoryId || !body.limit || body.limit <= 0 || !body.month) {
      return HttpResponse.json(
        { message: 'Некорректные данные бюджета' },
        { status: 400 },
      )
    }

    const duplicate = budgets.some(
      (budget) =>
        budget.categoryId === body.categoryId && budget.month === body.month,
    )
    if (duplicate) {
      return HttpResponse.json(
        { message: 'Лимит для этой категории и месяца уже существует' },
        { status: 409 },
      )
    }

    const created: Budget = {
      id: `budget-${Date.now()}`,
      categoryId: body.categoryId,
      limit: body.limit,
      month: body.month,
      spent: 0,
    }

    setBudgets([...budgets, created])
    return HttpResponse.json(withSpent([created])[0], { status: 201 })
  }),

  http.put('/api/budgets/:id', async ({ params, request }) => {
    await delay(350)
    const body = (await request.json()) as Partial<Budget>
    const index = budgets.findIndex((budget) => budget.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Бюджет не найден' },
        { status: 404 },
      )
    }

    if (body.limit !== undefined && body.limit <= 0) {
      return HttpResponse.json(
        { message: 'Лимит должен быть больше 0' },
        { status: 400 },
      )
    }

    const updated: Budget = {
      ...budgets[index],
      ...body,
      id: budgets[index].id,
    }

    const next = [...budgets]
    next[index] = updated
    setBudgets(next)

    return HttpResponse.json(withSpent([updated])[0])
  }),

  http.delete('/api/budgets/:id', async ({ params }) => {
    await delay(250)
    const exists = budgets.some((budget) => budget.id === params.id)
    if (!exists) {
      return HttpResponse.json(
        { message: 'Бюджет не найден' },
        { status: 404 },
      )
    }
    setBudgets(budgets.filter((budget) => budget.id !== params.id))
    return HttpResponse.json({ success: true }, { status: 200 })
  }),

  // Dashboard
  http.get('/api/dashboard/stats', async () => {
    await delay(400)
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const currentMonthTx = transactions.filter((tx) => {
      const date = new Date(tx.date)
      return date.getFullYear() === year && date.getMonth() === month
    })

    const totalIncome = currentMonthTx
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const totalExpenses = currentMonthTx
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const expenseMap = new Map<string, number>()
    currentMonthTx
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        expenseMap.set(
          tx.categoryId,
          (expenseMap.get(tx.categoryId) ?? 0) + tx.amount,
        )
      })

    const expensesByCategory = [...expenseMap.entries()]
      .map(([categoryId, amount]) => {
        const category = categories.find((item) => item.id === categoryId)
        return {
          categoryId,
          name: category?.name ?? categoryId,
          color: category?.color ?? '#94a3b8',
          amount,
        }
      })
      .sort((a, b) => b.amount - a.amount)

    const expenseCategories = categories.filter((c) => c.type === 'expense')
    const monthlyData = getMonthKeys(6, now).map(
      ({ year: y, month: m, monthKey, monthLabel }) => {
        const row: Record<string, string | number> = { monthKey, monthLabel }
        expenseCategories.forEach((category) => {
          row[category.id] = 0
        })

        transactions
          .filter((tx) => {
            if (tx.type !== 'expense') return false
            const date = new Date(tx.date)
            return date.getFullYear() === y && date.getMonth() === m
          })
          .forEach((tx) => {
            row[tx.categoryId] = Number(row[tx.categoryId] ?? 0) + tx.amount
          })

        return row
      },
    )

    return HttpResponse.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      topCategory: expensesByCategory[0] ?? null,
      expensesByCategory,
      monthlyData,
      hasData: currentMonthTx.length > 0,
    })
  }),
]
