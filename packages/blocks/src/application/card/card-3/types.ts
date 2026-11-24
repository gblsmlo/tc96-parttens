import type {
  CardBadgeData,
  CardLoadLabels,
  CardLoadProps,
} from '../shared/types'

export interface Card3Stat {
  id: string
  label: string
  value: number
}

export interface Card3Profile {
  availability?: CardBadgeData
  id: string
  imageUrl?: string
  name: string
  role: string
  stats: Card3Stat[]
}

export interface Card3Labels extends CardLoadLabels {
  follow: string
  message: string
  stats: string
  title: string
}

export interface Card3Props extends CardLoadProps {
  className?: string
  labels?: Partial<Card3Labels>
  locale?: string
  onFollow?: (id: string) => void
  onMessage?: (id: string) => void
  profile?: Card3Profile
}
