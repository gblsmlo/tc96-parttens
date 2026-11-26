import type {
  Crm3Archived,
  Crm3GroupBy,
  Crm3Lead,
  Crm3Mode,
  Crm3Origin,
  Crm3Sort,
  Crm3Stage,
  Crm3View,
} from './types'

export const crm3Modes: readonly Crm3Mode[] = ['kanban', 'table']

export const crm3Views: readonly Crm3View[] = ['all']

export const crm3Groupings: readonly Crm3GroupBy[] = [
  'stage',
  'owner',
  'origin',
]

export const crm3Sorts: readonly Crm3Sort[] = [
  'created',
  'updated',
  'next-action',
  'value',
]

export const crm3Origins: readonly Crm3Origin[] = [
  'referral',
  'website',
  'social-media',
  'paid-ads',
  'event',
  'existing-client',
  'other',
]

export const crm3ArchivedChoices: readonly Crm3Archived[] = [
  'exclude',
  'include',
  'only',
]

export const canEditCrm3Lead = (lead: Crm3Lead) => lead.editable !== false

export const canMoveCrm3Lead = (lead: Crm3Lead) =>
  canEditCrm3Lead(lead) && lead.status === 'open' && !lead.archived

export const canArchiveCrm3Lead = (lead: Crm3Lead) =>
  canEditCrm3Lead(lead) && !lead.archived

export const activeCrm3Stages = (stages: readonly Crm3Stage[]) =>
  stages.filter((stage) => !stage.inactive)
