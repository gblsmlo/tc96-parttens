import {
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  DatabaseIcon,
  EnvelopeOpenIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Support2Queue, Support2Status } from './types'

export const support2Queues: readonly Support2Queue[] = [
  'platform',
  'billing',
  'authentication',
  'integrations',
]

export const support2Statuses: readonly Support2Status[] = [
  'open',
  'pending',
  'resolved',
]

export const support2QueueAppearance = {
  authentication: { icon: ShieldCheckIcon, tone: 'info' },
  billing: { icon: CreditCardIcon, tone: 'warning' },
  integrations: { icon: PuzzlePieceIcon, tone: 'success' },
  platform: { icon: DatabaseIcon, tone: 'neutral' },
} as const satisfies Record<Support2Queue, DataOptionAppearance>

export const support2StatusAppearance = {
  open: { icon: EnvelopeOpenIcon, tone: 'info' },
  pending: { icon: ClockIcon, tone: 'warning' },
  resolved: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Support2Status, DataOptionAppearance>
