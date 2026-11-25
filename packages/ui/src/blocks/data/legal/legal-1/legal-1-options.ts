import {
  CheckCircleIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PauseCircleIcon,
  PencilSimpleIcon,
  ScalesIcon,
  TrayIcon,
} from '@phosphor-icons/react'
import type { LegalOptionAppearance } from '../shared/types'
import type {
  Legal1Phase,
  Legal1Queue,
  Legal1Status,
  Legal1View,
} from './types'

export const legal1Queues: readonly Legal1Queue[] = [
  'intake',
  'drafting',
  'hearings',
  'review',
]

export const legal1Statuses: readonly Legal1Status[] = [
  'active',
  'suspended',
  'settled',
  'closed',
]

export const legal1Phases: readonly Legal1Phase[] = [
  'filing',
  'evidence',
  'judgment',
  'appeal',
  'enforcement',
]

export const legal1QueueAppearance = {
  drafting: { icon: PencilSimpleIcon, tone: 'info' },
  hearings: { icon: MicrophoneIcon, tone: 'warning' },
  intake: { icon: TrayIcon, tone: 'neutral' },
  review: { icon: MagnifyingGlassIcon, tone: 'info' },
} as const satisfies Record<Legal1Queue, LegalOptionAppearance>

export const legal1StatusAppearance = {
  active: { icon: ScalesIcon, tone: 'info' },
  closed: { icon: CheckCircleIcon, tone: 'neutral' },
  settled: { icon: HandshakeIcon, tone: 'success' },
  suspended: { icon: PauseCircleIcon, tone: 'warning' },
} as const satisfies Record<Legal1Status, LegalOptionAppearance>

export const legal1Views: readonly Legal1View[] = ['all', 'lawsuits', 'matters']
