import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  CircleIcon,
  EyeIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Projects1Status } from './types'

export const projects1Statuses: readonly Projects1Status[] = [
  'backlog',
  'todo',
  'inProgress',
  'review',
  'done',
]

export const projects1StatusAppearance = {
  backlog: { icon: CircleDashedIcon, tone: 'neutral' },
  done: { icon: CheckCircleIcon, tone: 'success' },
  inProgress: { icon: CircleHalfIcon, tone: 'warning' },
  review: { icon: EyeIcon, tone: 'info' },
  todo: { icon: CircleIcon, tone: 'info' },
} as const satisfies Record<Projects1Status, DataOptionAppearance>
