import {
  CheckCircleIcon,
  CurrencyCircleDollarIcon,
  HandshakeIcon,
  HeadsetIcon,
  MinusCircleIcon,
  SparkleIcon,
  UserPlusIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import type { LegalOptionAppearance } from '../shared/types'
import type { Legal4Queue, Legal4Status } from './types'

export const legal4Queues: readonly Legal4Queue[] = [
  'onboarding',
  'service',
  'billing',
  'relationship',
]

export const legal4Statuses: readonly Legal4Status[] = [
  'prospect',
  'active',
  'defaulting',
  'inactive',
]

export const legal4QueueAppearance = {
  billing: { icon: CurrencyCircleDollarIcon, tone: 'warning' },
  onboarding: { icon: UserPlusIcon, tone: 'info' },
  relationship: { icon: HandshakeIcon, tone: 'success' },
  service: { icon: HeadsetIcon, tone: 'neutral' },
} as const satisfies Record<Legal4Queue, LegalOptionAppearance>

export const legal4StatusAppearance = {
  active: { icon: CheckCircleIcon, tone: 'success' },
  defaulting: { icon: WarningIcon, tone: 'danger' },
  inactive: { icon: MinusCircleIcon, tone: 'neutral' },
  prospect: { icon: SparkleIcon, tone: 'info' },
} as const satisfies Record<Legal4Status, LegalOptionAppearance>
