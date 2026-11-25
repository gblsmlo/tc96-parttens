import {
  ArrowDownLeftIcon,
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  ClockIcon,
  ProhibitIcon,
  WarningCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  Finance3CategoryDirection,
  Finance3ChargeStatus,
  Finance3Direction,
  Finance3EntryColumnId,
  Finance3EntryKind,
  Finance3EntrySortColumn,
  Finance3EntryType,
  Finance3FeeType,
  Finance3Situation,
  Finance3Variant,
  Finance3View,
} from './types'

export const finance3Variants: readonly Finance3Variant[] = [
  'entries',
  'receivables',
  'statement',
  'clientMoney',
]

export const finance3Views: readonly Finance3View[] = [
  'all',
  'receivable',
  'payable',
  'collection',
  'settled',
]

export const finance3Situations: readonly Finance3Situation[] = [
  'open',
  'overdue',
  'settled',
  'renegotiated',
  'canceled',
]

export const finance3SituationAppearance = {
  canceled: { icon: ProhibitIcon, tone: 'neutral' },
  open: { icon: CircleDashedIcon, tone: 'neutral' },
  overdue: { icon: WarningCircleIcon, tone: 'danger' },
  renegotiated: { icon: ArrowsClockwiseIcon, tone: 'neutral' },
  settled: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Finance3Situation, DataOptionAppearance>

export const finance3EntryKinds: readonly Finance3EntryKind[] = [
  'fee',
  'other_income',
  'expense',
  'transfer',
  'expense_reimbursement',
  'client_money_in',
  'client_money_out',
]

export const finance3KindDirection = {
  client_money_in: 'in',
  client_money_out: 'out',
  expense: 'out',
  expense_reimbursement: 'in',
  fee: 'in',
  other_income: 'in',
  transfer: 'none',
} as const satisfies Record<Finance3EntryKind, Finance3Direction>

const inflow: DataOptionAppearance = {
  icon: ArrowDownLeftIcon,
  tone: 'success',
}
const outflow: DataOptionAppearance = {
  icon: ArrowUpRightIcon,
  tone: 'neutral',
}

export const finance3KindAppearance = {
  client_money_in: inflow,
  client_money_out: outflow,
  expense: outflow,
  expense_reimbursement: inflow,
  fee: inflow,
  other_income: inflow,
  transfer: { icon: ArrowsLeftRightIcon, tone: 'neutral' },
} as const satisfies Record<Finance3EntryKind, DataOptionAppearance>

export const finance3CategoryDirectionOf = {
  in: 'income',
  none: null,
  out: 'expense',
} as const satisfies Record<Finance3Direction, Finance3CategoryDirection | null>

export const finance3EntryTypes: readonly Finance3EntryType[] = [
  'income',
  'expense',
  'transfer',
]

export const finance3FeeTypes: readonly Finance3FeeType[] = [
  'contractual',
  'success',
  'sucumbencia',
]

export const finance3ChargeStatuses: readonly Finance3ChargeStatus[] = [
  'active',
  'paid',
  'canceled',
  'amount_mismatch',
  'paid_after_cancel',
]

export const finance3ChargeAppearance = {
  active: { icon: ClockIcon, tone: 'info' },
  amount_mismatch: { icon: WarningIcon, tone: 'danger' },
  canceled: { icon: ProhibitIcon, tone: 'neutral' },
  paid: { icon: CheckCircleIcon, tone: 'success' },
  paid_after_cancel: { icon: WarningIcon, tone: 'danger' },
} as const satisfies Record<Finance3ChargeStatus, DataOptionAppearance>

export const finance3DefaultHiddenColumns: readonly Finance3EntryColumnId[] = [
  'account',
  'category',
  'feeType',
  'responsible',
]

export const finance3EntrySortColumns: readonly Finance3EntrySortColumn[] = [
  'description',
  'kind',
  'feeType',
  'payer',
  'target',
  'responsible',
  'account',
  'category',
  'due',
  'amount',
]
