import type { Category } from './types'

/** Fallback categories — prefer GET /api/categories in runtime */
export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Продукты', icon: '🛒', color: '#22c55e', type: 'expense' },
  { id: 'cat2', name: 'Транспорт', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { id: 'cat3', name: 'Развлечения', icon: '🎬', color: '#f97316', type: 'expense' },
  { id: 'cat4', name: 'Здоровье', icon: '💊', color: '#ef4444', type: 'expense' },
  { id: 'cat5', name: 'Кафе', icon: '☕', color: '#eab308', type: 'expense' },
  { id: 'cat6', name: 'Зарплата', icon: '💰', color: '#22c55e', type: 'income' },
  { id: 'cat7', name: 'Фриланс', icon: '💻', color: '#8b5cf6', type: 'income' },
  { id: 'cat8', name: 'Проценты', icon: '📈', color: '#06b6d4', type: 'income' },
]
