import {
  CheckCircleIcon,
  GraduationCapIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Marketing1Status } from './types'

export const marketing1Statuses: readonly Marketing1Status[] = [
  'active',
  'learning',
  'paused',
  'ended',
]

export const marketing1StatusAppearance = {
  active: { icon: PlayCircleIcon, tone: 'success' },
  ended: { icon: CheckCircleIcon, tone: 'neutral' },
  learning: { icon: GraduationCapIcon, tone: 'info' },
  paused: { icon: PauseCircleIcon, tone: 'warning' },
} as const satisfies Record<Marketing1Status, DataOptionAppearance>
