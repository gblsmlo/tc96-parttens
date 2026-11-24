import type { ReactNode } from 'react'
import type { ListLoadLabels, ListLoadProps } from '../shared/types'

export type List2Range = '7d' | '30d' | '12m'

export interface List2Entry {
  amount: number
  icon?: ReactNode
  id: string
  name: string
  share: number
}

export interface List2Labels extends ListLoadLabels {
  emptyDescription: string
  emptyTitle: string
  range: string
  ranges: Record<List2Range, string>
  rank: (position: number) => string
  title: string
}

export interface List2Props extends ListLoadProps {
  className?: string
  currency?: string
  entries: List2Entry[]
  labels?: Partial<List2Labels>
  locale?: string
  onRangeChange?: (range: List2Range) => void
  range: List2Range
  ranges?: List2Range[]
}
