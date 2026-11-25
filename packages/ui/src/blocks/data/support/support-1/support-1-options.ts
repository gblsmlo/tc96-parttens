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
import type { Support1Queue, Support1Status } from './types'

export const support1Queues: readonly Support1Queue[] = [
  'platform',
  'billing',
  'authentication',
  'integrations',
]

export const support1Statuses: readonly Support1Status[] = [
  'open',
  'pending',
  'resolved',
]

export const support1QueueAppearance = {
  authentication: { icon: ShieldCheckIcon, tone: 'info' },
  billing: { icon: CreditCardIcon, tone: 'warning' },
  integrations: { icon: PuzzlePieceIcon, tone: 'success' },
  platform: { icon: DatabaseIcon, tone: 'neutral' },
} as const satisfies Record<Support1Queue, DataOptionAppearance>

export const support1StatusAppearance = {
  open: { icon: EnvelopeOpenIcon, tone: 'info' },
  pending: { icon: ClockIcon, tone: 'warning' },
  resolved: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Support1Status, DataOptionAppearance>
