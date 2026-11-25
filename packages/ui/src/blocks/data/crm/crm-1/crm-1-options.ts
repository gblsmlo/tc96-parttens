import type {
  Crm1Archived,
  Crm1LeadStatus,
  Crm1Mode,
  Crm1Sort,
  Crm1Variant,
} from './types'

export const crm1Variants: readonly Crm1Variant[] = ['people', 'companies']

export const crm1Modes: readonly Crm1Mode[] = ['list', 'table']

export const crm1Sorts: readonly Crm1Sort[] = [
  'name_asc',
  'name_desc',
  'created_desc',
]

export const crm1ArchivedChoices: readonly Crm1Archived[] = ['include', 'only']

export const crm1LeadStatuses: readonly Crm1LeadStatus[] = [
  'open',
  'won',
  'lost',
]
