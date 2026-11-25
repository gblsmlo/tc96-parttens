import type {
  Crm2Archived,
  Crm2GroupBy,
  Crm2Lead,
  Crm2Mode,
  Crm2Origin,
  Crm2Sort,
  Crm2Stage,
  Crm2View,
} from './types'

export const crm2Modes: readonly Crm2Mode[] = ['kanban', 'table']

export const crm2Views: readonly Crm2View[] = ['all']

export const crm2Groupings: readonly Crm2GroupBy[] = [
  'stage',
  'owner',
  'origin',
]

export const crm2Sorts: readonly Crm2Sort[] = [
  'created',
  'updated',
  'next-action',
  'value',
]

export const crm2Origins: readonly Crm2Origin[] = [
  'referral',
  'website',
  'social-media',
  'paid-ads',
  'event',
  'existing-client',
  'other',
]

export const crm2ArchivedChoices: readonly Crm2Archived[] = ['only', 'include']

export const canEditCrm2Lead = (lead: Crm2Lead) => lead.editable !== false

export const canMoveCrm2Lead = (lead: Crm2Lead) =>
  canEditCrm2Lead(lead) && lead.status === 'open' && !lead.archived

export const canArchiveCrm2Lead = (lead: Crm2Lead) =>
  canEditCrm2Lead(lead) && !lead.archived

export const activeCrm2Stages = (stages: readonly Crm2Stage[]) =>
  stages.filter((stage) => !stage.inactive)
