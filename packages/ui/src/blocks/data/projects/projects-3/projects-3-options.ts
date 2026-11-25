import {
  CheckCircleIcon,
  CircleHalfIcon,
  CircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  Projects3Archived,
  Projects3GroupBy,
  Projects3KanbanGroupBy,
  Projects3Mode,
  Projects3Sort,
  Projects3Status,
} from './types'

export const projects3Modes: readonly Projects3Mode[] = ['table', 'kanban']

export const projects3Statuses: readonly Projects3Status[] = [
  'pending',
  'in-progress',
  'completed',
  'canceled',
]

export const projects3StatusAppearance = {
  canceled: { icon: XCircleIcon, tone: 'neutral' },
  completed: { icon: CheckCircleIcon, tone: 'success' },
  'in-progress': { icon: CircleHalfIcon, tone: 'info' },
  pending: { icon: CircleIcon, tone: 'neutral' },
} as const satisfies Record<Projects3Status, DataOptionAppearance>

export const projects3Sorts: readonly Projects3Sort[] = [
  'newest',
  'due',
  'priority',
]

export const projects3GroupBys: readonly Projects3GroupBy[] = [
  'status',
  'priority',
  'assignee',
]

export const projects3KanbanGroupBys: readonly Projects3KanbanGroupBy[] = [
  'status',
  'priority',
]

export const projects3ArchivedChoices: readonly Projects3Archived[] = [
  'include',
  'only',
]

export const projects3NoGroup = 'none'
