import type {
  CardBadgeData,
  CardLoadLabels,
  CardLoadProps,
  CardMenuAction,
} from '../shared/types'

export interface Card9Delivery {
  address: string
  addressTag?: CardBadgeData
  duration: string
  notes?: string
  tracking: string
  trackingStatus?: string
  updatedAt?: string
}

export interface Card9Labels extends CardLoadLabels {
  address: string
  duration: string
  more: string
  notes: string
  title: string
  tracking: string
}

export interface Card9Props extends CardLoadProps {
  actions?: readonly CardMenuAction[]
  className?: string
  delivery?: Card9Delivery
  labels?: Partial<Card9Labels>
  onActionSelect?: (actionId: string) => void
}
