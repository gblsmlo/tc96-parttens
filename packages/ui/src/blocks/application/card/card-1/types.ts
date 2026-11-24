import type { AvatarStackPerson } from '@tc96/ui/patterns/widgets/shared/avatar-stack'
import type { ReactNode } from 'react'
import type {
  CardBadgeData,
  CardLoadLabels,
  CardLoadProps,
} from '../shared/types'

export type Card1Accent =
  | { badge: CardBadgeData; kind: 'badge' }
  | { icon: ReactNode; kind: 'icon' }
  | { kind: 'people'; people: AvatarStackPerson[] }

export interface Card1Fact {
  accent?: Card1Accent
  id: string
  label: string
  value: string
}

export interface Card1Labels extends CardLoadLabels {
  title: string
}

export interface Card1Props extends CardLoadProps {
  className?: string
  facts: Card1Fact[]
  labels?: Partial<Card1Labels>
}
