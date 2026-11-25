import {
  ArrowsClockwiseIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  SignatureIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import type { LegalOptionAppearance } from '../shared/types'
import type { Legal2Queue, Legal2Status } from './types'

export const legal2Queues: readonly Legal2Queue[] = [
  'drafting',
  'negotiation',
  'signature',
  'renewal',
]

export const legal2Statuses: readonly Legal2Status[] = [
  'draft',
  'review',
  'signed',
  'expired',
]

export const legal2QueueAppearance = {
  drafting: { icon: PencilSimpleIcon, tone: 'neutral' },
  negotiation: { icon: ChatCircleIcon, tone: 'info' },
  renewal: { icon: ArrowsClockwiseIcon, tone: 'warning' },
  signature: { icon: SignatureIcon, tone: 'info' },
} as const satisfies Record<Legal2Queue, LegalOptionAppearance>

export const legal2StatusAppearance = {
  draft: { icon: FileTextIcon, tone: 'neutral' },
  expired: { icon: WarningIcon, tone: 'danger' },
  review: { icon: MagnifyingGlassIcon, tone: 'warning' },
  signed: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Legal2Status, LegalOptionAppearance>
