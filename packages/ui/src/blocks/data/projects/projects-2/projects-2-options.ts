import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  CircleIcon,
  EyeIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Projects2Status } from './types'

export const projects2Statuses: readonly Projects2Status[] = [
  'backlog',
  'todo',
  'inProgress',
  'review',
  'done',
]

export const projects2StatusAppearance = {
  backlog: { icon: CircleDashedIcon, tone: 'neutral' },
  done: { icon: CheckCircleIcon, tone: 'success' },
  inProgress: { icon: CircleHalfIcon, tone: 'warning' },
  review: { icon: EyeIcon, tone: 'info' },
  todo: { icon: CircleIcon, tone: 'info' },
} as const satisfies Record<Projects2Status, DataOptionAppearance>
