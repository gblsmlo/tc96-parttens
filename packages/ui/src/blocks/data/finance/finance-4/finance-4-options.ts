import {
  ArrowDownLeftIcon,
  ArrowsClockwiseIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  ProhibitIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  Finance4ColumnId,
  Finance4Direction,
  Finance4EntryKind,
  Finance4FeeType,
  Finance4GroupBy,
  Finance4KanbanGroupBy,
  Finance4Mode,
  Finance4Situation,
  Finance4Sort,
  Finance4SortDirection,
  Finance4View,
} from './types'

export const finance4Modes: readonly Finance4Mode[] = [
  'list',
  'table',
  'kanban',
]

export const finance4Views: readonly Finance4View[] = [
  'all',
  'receivable',
  'payable',
]

export const finance4Situations: readonly Finance4Situation[] = [
  'open',
  'overdue',
  'renegotiated',
  'settled',
  'canceled',
]

export const finance4SituationAppearance = {
  canceled: { icon: ProhibitIcon, tone: 'neutral' },
  open: { icon: CircleDashedIcon, tone: 'neutral' },
  overdue: { icon: WarningCircleIcon, tone: 'danger' },
  renegotiated: { icon: ArrowsClockwiseIcon, tone: 'neutral' },
  settled: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Finance4Situation, DataOptionAppearance>

export const finance4EntryKinds: readonly Finance4EntryKind[] = [
  'fee',
  'expense_reimbursement',
  'expense',
  'client_money_in',
  'client_money_out',
]

export const finance4KindDirection = {
  client_money_in: 'in',
  client_money_out: 'out',
  expense: 'out',
  expense_reimbursement: 'in',
  fee: 'in',
} as const satisfies Record<Finance4EntryKind, Finance4Direction>

export const finance4DirectionAppearance = {
  in: { icon: ArrowDownLeftIcon, tone: 'success' },
  out: { icon: ArrowUpRightIcon, tone: 'neutral' },
} as const satisfies Record<Finance4Direction, DataOptionAppearance>

export const finance4KindAppearance = {
  client_money_in: finance4DirectionAppearance.in,
  client_money_out: finance4DirectionAppearance.out,
  expense: finance4DirectionAppearance.out,
  expense_reimbursement: finance4DirectionAppearance.in,
  fee: finance4DirectionAppearance.in,
} as const satisfies Record<Finance4EntryKind, DataOptionAppearance>

export const finance4FeeTypes: readonly Finance4FeeType[] = [
  'contractual',
  'success',
  'sucumbencia',
]

export const finance4Sorts: readonly Finance4Sort[] = [
  'due',
  'amount',
  'updated',
  'client',
]

export const finance4DefaultSortDirection = {
  amount: 'desc',
  client: 'asc',
  due: 'asc',
  updated: 'desc',
} as const satisfies Record<Finance4Sort, Finance4SortDirection>

export const finance4GroupBys: readonly Finance4GroupBy[] = [
  'situation',
  'kind',
  'client',
  'case',
]

export const finance4KanbanGroupBys: readonly Finance4KanbanGroupBy[] = [
  'situation',
]

export const finance4NoGroup = 'none'

export const finance4LeadingWidth = 'w-5'

export const finance4FieldWidth = {
  amount: 'w-32',
  client: 'w-44',
  due: 'w-28',
  responsible: 'w-40',
  situation: 'w-32',
} as const satisfies Partial<Record<Finance4ColumnId, string>>
