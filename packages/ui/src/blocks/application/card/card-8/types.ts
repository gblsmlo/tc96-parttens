import type { AvatarStackPerson } from '@tc96/ui/patterns/widgets/shared/avatar-stack'
import type { ReactNode } from 'react'
import type {
  CardBadgeData,
  CardLoadLabels,
  CardLoadProps,
  CardMenuAction,
} from '../shared/types'

export interface Card8Meeting {
  description?: string
  duration: string
  id: string
  people?: readonly AvatarStackPerson[]
  providerIcon?: ReactNode
  tag?: CardBadgeData
  time: string
  title: string
}

export interface Card8Labels extends CardLoadLabels {
  emptyDescription: string
  emptyTitle: string
  heading: string
  join: string
  joinTo: (title: string) => string
  more: (title: string) => string
  people: string
  title: string
}

export interface Card8Props extends CardLoadProps {
  actions?: readonly CardMenuAction[]
  className?: string
  labels?: Partial<Card8Labels>
  meetings: readonly Card8Meeting[]
  onActionSelect?: (meetingId: string, actionId: string) => void
  onJoin?: (meetingId: string) => void
}
