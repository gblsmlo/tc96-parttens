import { CheckCircleIcon, LockSimpleIcon } from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  Legal9BillingModel,
  Legal9GroupBy,
  Legal9Mode,
  Legal9Sort,
  Legal9Status,
} from './types'

export const legal9Modes: readonly Legal9Mode[] = ['table', 'list']

export const legal9Statuses: readonly Legal9Status[] = ['active', 'closed']

export const legal9BillingModels: readonly Legal9BillingModel[] = [
  'fixed',
  'hourly',
  'subscription',
  'contingency',
  'other',
]

export const legal9Sorts: readonly Legal9Sort[] = ['updated', 'title', 'amount']

export const legal9Groupings: readonly Legal9GroupBy[] = [
  'status',
  'billingModel',
  'owner',
]

export const legal9StatusAppearance = {
  active: { icon: CheckCircleIcon, tone: 'success' },
  closed: { icon: LockSimpleIcon, tone: 'neutral' },
} as const satisfies Record<Legal9Status, DataOptionAppearance>

export const pickLegal9 = <TValue extends string>(
  values: readonly TValue[],
  value: string | null,
): TValue | null => values.find((item) => item === value) ?? null
