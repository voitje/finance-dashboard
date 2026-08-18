import type { Category } from '@/entities/category'
import type { Transaction, TransactionType } from '@/entities/transaction'
import type { Budget } from '@/entities/budget'
import type { User } from '@/entities/user'

export type MockUser = User & { password: string }

export const users: MockUser[] = [
  {
    id: '1',
    name: 'Тестовый Пользователь',
    email: 'test@example.com',
    password: 'admin',
  },
]

export const categories: Category[] = [
  { id: 'cat1', name: 'Продукты', icon: '🛒', color: '#22c55e', type: 'expense' },
  { id: 'cat2', name: 'Транспорт', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { id: 'cat3', name: 'Развлечения', icon: '🎬', color: '#f97316', type: 'expense' },
  { id: 'cat4', name: 'Здоровье', icon: '💊', color: '#ef4444', type: 'expense' },
  { id: 'cat5', name: 'Кафе', icon: '☕', color: '#eab308', type: 'expense' },
  { id: 'cat6', name: 'Зарплата', icon: '💰', color: '#22c55e', type: 'income' },
  { id: 'cat7', name: 'Фриланс', icon: '💻', color: '#8b5cf6', type: 'income' },
  { id: 'cat8', name: 'Проценты', icon: '📈', color: '#06b6d4', type: 'income' },
]

const EXPENSE_DESCRIPTIONS = [
  'Продукты на неделю',
  'Супермаркет',
  'Метро',
  'Такси',
  'Бензин',
  'Кино',
  'Концерт',
  'Аптека',
  'Врач',
  'Кофе с коллегами',
  'Обед в кафе',
  'Доставка еды',
  'Подписка',
  'Ремонт',
  'Хозтовары',
]

const INCOME_DESCRIPTIONS = [
  'Зарплата',
  'Премия',
  'Фриланс-проект',
  'Консультация',
  'Дивиденды',
  'Проценты по вкладу',
  'Возврат налога',
  'Подработка',
]

const createSeededRandom = (seed: number) => {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

const randomInt = (random: () => number, min: number, max: number) =>
  Math.floor(random() * (max - min + 1)) + min

const pick = <T>(random: () => number, items: T[]): T =>
  items[Math.floor(random() * items.length)]

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

const generateTransactions = (): Transaction[] => {
  const random = createSeededRandom(42)
  const now = new Date()
  const expenseCats = categories.filter((c) => c.type === 'expense')
  const incomeCats = categories.filter((c) => c.type === 'income')
  const result: Transaction[] = []

  for (let i = 0; i < 50; i += 1) {
    const isIncome = random() < 0.3
    const type: TransactionType = isIncome ? 'income' : 'expense'
    const category = pick(random, isIncome ? incomeCats : expenseCats)
    const daysAgo = randomInt(random, 0, 89)
    const date = new Date(now)
    date.setDate(now.getDate() - daysAgo)

    const amount = isIncome
      ? randomInt(random, 5000, 200000)
      : randomInt(random, 100, 15000)

    result.push({
      id: `tx-${i + 1}`,
      amount,
      categoryId: category.id,
      description: pick(
        random,
        isIncome ? INCOME_DESCRIPTIONS : EXPENSE_DESCRIPTIONS,
      ),
      date: formatDate(date),
      type,
      createdAt: date.toISOString(),
    })
  }

  return result.sort((a, b) => b.date.localeCompare(a.date))
}

/** Mutable store used by MSW handlers */
export let transactions: Transaction[] = generateTransactions()

const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export let budgets: Budget[] = [
  {
    id: 'budget-1',
    categoryId: 'cat1',
    limit: 25000,
    spent: 0,
    month: currentMonth(),
  },
  {
    id: 'budget-2',
    categoryId: 'cat2',
    limit: 8000,
    spent: 0,
    month: currentMonth(),
  },
  {
    id: 'budget-3',
    categoryId: 'cat3',
    limit: 12000,
    spent: 0,
    month: currentMonth(),
  },
  {
    id: 'budget-4',
    categoryId: 'cat5',
    limit: 6000,
    spent: 0,
    month: currentMonth(),
  },
]

export const setTransactions = (next: Transaction[]) => {
  transactions = next
}

export const setBudgets = (next: Budget[]) => {
  budgets = next
}

export const VALID_TOKEN_PREFIX = 'mock-jwt-'
