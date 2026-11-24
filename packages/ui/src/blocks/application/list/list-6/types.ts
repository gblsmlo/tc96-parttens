import type { ListLoadLabels, ListLoadProps } from '../shared/types'
export type List6MoverStatus = 'delayed' | 'halted' | 'live'

export interface List6Mover {
  change: number
  id: string
  name: string
  price: number
  status: List6MoverStatus
}

export interface List6Labels extends ListLoadLabels {
  columnChange: string
  columnName: string
  columnPrice: string
  columnStatus: string
  emptyDescription: string
  emptyTitle: string
  noResultDescription: string
  noResultTitle: string
  search: string
  searchPlaceholder: string
  statuses: Record<List6MoverStatus, string>
  title: string
}

export interface List6Props extends ListLoadProps {
  className?: string
  currency?: string
  labels?: Partial<List6Labels>
  locale?: string
  movers: readonly List6Mover[]
  onQueryChange: (query: string) => void
  query: string
}
