import {
  CheckCircleIcon,
  GraduationCapIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Marketing2Status } from './types'

export const marketing2Statuses: readonly Marketing2Status[] = [
  'active',
  'learning',
  'paused',
  'ended',
]

export const marketing2StatusAppearance = {
  active: { icon: PlayCircleIcon, tone: 'success' },
  ended: { icon: CheckCircleIcon, tone: 'neutral' },
  learning: { icon: GraduationCapIcon, tone: 'info' },
  paused: { icon: PauseCircleIcon, tone: 'warning' },
} as const satisfies Record<Marketing2Status, DataOptionAppearance>
