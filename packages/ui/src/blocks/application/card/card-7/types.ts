import type { ReactNode } from 'react'
import type {
  CardBadgeData,
  CardLoadLabels,
  CardLoadProps,
} from '../shared/types'

export interface Card7Contact {
  avatarUrl?: string
  email: string
  name: string
  status?: CardBadgeData
}

export interface Card7Stat {
  id: string
  label: string
  value: string
}

export interface Card7Item {
  amount: number
  color?: string
  currency?: string
  icon: ReactNode
  id: string
  label: string
}

export interface Card7Labels extends CardLoadLabels {
  action: string
  items: string
  stats: string
}

export interface Card7Props extends CardLoadProps {
  actionIcon?: ReactNode
  className?: string
  contact?: Card7Contact
  currency?: string
  items?: readonly Card7Item[]
  labels?: Partial<Card7Labels>
  locale?: string
  onAction?: () => void
  stats?: readonly Card7Stat[]
}
