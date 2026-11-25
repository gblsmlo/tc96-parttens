import {
  CheckCircleIcon,
  HourglassIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  TrayIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Legal3Queue, Legal3Status } from './types'

export const legal3Queues: readonly Legal3Queue[] = [
  'intake',
  'drafting',
  'review',
  'filing',
]

export const legal3Statuses: readonly Legal3Status[] = [
  'pending',
  'done',
  'missed',
]

export const legal3QueueAppearance = {
  drafting: { icon: PencilSimpleIcon, tone: 'info' },
  filing: { icon: PaperPlaneTiltIcon, tone: 'success' },
  intake: { icon: TrayIcon, tone: 'neutral' },
  review: { icon: MagnifyingGlassIcon, tone: 'warning' },
} as const satisfies Record<Legal3Queue, DataOptionAppearance>

export const legal3StatusAppearance = {
  done: { icon: CheckCircleIcon, tone: 'success' },
  missed: { icon: XCircleIcon, tone: 'danger' },
  pending: { icon: HourglassIcon, tone: 'warning' },
} as const satisfies Record<Legal3Status, DataOptionAppearance>

export const legal3ChipTones = {
  done: 'success',
  missed: 'destructive',
  pending: 'primary',
} as const satisfies Record<Legal3Status, string>
