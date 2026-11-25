import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  CircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  Tasks1GroupBy,
  Tasks1HideableColumnId,
  Tasks1Sort,
  Tasks1Status,
} from './types'

export const tasks1Statuses: readonly Tasks1Status[] = [
  'backlog',
  'todo',
  'in-progress',
  'done',
  'canceled',
]

export const tasks1StatusAppearance = {
  backlog: { icon: CircleDashedIcon, tone: 'neutral' },
  canceled: { icon: XCircleIcon, tone: 'neutral' },
  done: { icon: CheckCircleIcon, tone: 'success' },
  'in-progress': { icon: CircleHalfIcon, tone: 'info' },
  todo: { icon: CircleIcon, tone: 'neutral' },
} as const satisfies Record<Tasks1Status, DataOptionAppearance>

export const tasks1Sorts: readonly Tasks1Sort[] = [
  'updated',
  'due',
  'priority',
  'title',
]

export const tasks1GroupBys: readonly Tasks1GroupBy[] = ['status', 'priority']

export const tasks1HideableColumns: readonly Tasks1HideableColumnId[] = [
  'tags',
  'due',
  'project',
  'assignees',
  'priority',
  'updated',
]

export const tasks1NoGroup = 'none'
