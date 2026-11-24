import type { ReactNode } from 'react'

export type List3Period = 'week' | 'month' | 'year'

export interface List3Transaction {
  amount: number
  date: string
  description: string
  icon?: ReactNode
  id: string
}

export interface List3Labels {
  credit: string
  debit: string
  emptyDescription: string
  emptyTitle: string
  period: string
  periods: Record<List3Period, string>
  title: string
}

export interface List3Props {
  className?: string
  currency?: string
  labels?: Partial<List3Labels>
  locale?: string
  onPeriodChange?: (period: List3Period) => void
  period: List3Period
  periods?: List3Period[]
  transactions: List3Transaction[]
}
