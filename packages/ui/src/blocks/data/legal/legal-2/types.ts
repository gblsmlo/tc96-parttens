import type {
  LegalFormatProps,
  LegalLoadLabels,
  LegalLoadProps,
  LegalModeLabels,
  LegalPerson,
  LegalToolbarLabels,
} from '../shared/types'

export type Legal2Mode = 'list' | 'table'

export type Legal2Type = 'fees' | 'lease' | 'nda' | 'partnership' | 'services'

export type Legal2Queue = 'drafting' | 'negotiation' | 'renewal' | 'signature'

export type Legal2Status = 'draft' | 'expired' | 'review' | 'signed'

export type Legal2Person = LegalPerson

export interface Legal2Contract {
  client: string
  code: string
  counterparty: string
  endsOn: string | null
  id: string
  ownerId: string | null
  queue: Legal2Queue
  startsOn: string | null
  status: Legal2Status
  title: string
  type: Legal2Type
  value: number | null
}

export type Legal2ColumnId =
  | 'contract'
  | 'owner'
  | 'parties'
  | 'queue'
  | 'status'
  | 'term'
  | 'type'
  | 'value'

export interface Legal2Labels extends LegalLoadLabels, LegalToolbarLabels {
  columns: Record<Legal2ColumnId, string>
  empty: string
  modes: LegalModeLabels
  noEndDate: string
  noValue: string
  openContract: (title: string) => string
  queues: Record<Legal2Queue, string>
  statuses: Record<Legal2Status, string>
  summary: (visible: number, signed: number) => string
  types: Record<Legal2Type, string>
  unassigned: string
}

export type Legal2LabelsOverride = Partial<
  Omit<Legal2Labels, 'columns' | 'modes' | 'queues' | 'statuses' | 'types'>
> & {
  columns?: Partial<Legal2Labels['columns']>
  modes?: Partial<Legal2Labels['modes']>
  queues?: Partial<Legal2Labels['queues']>
  statuses?: Partial<Legal2Labels['statuses']>
  types?: Partial<Legal2Labels['types']>
}

export interface Legal2Props extends LegalFormatProps, LegalLoadProps {
  className?: string
  contracts: Legal2Contract[]
  currency?: string
  labels?: Legal2LabelsOverride
  mode?: Legal2Mode
  onCreate?: () => void
  onExport?: () => void
  onModeChange?: (mode: Legal2Mode) => void
  onOpen?: (contractId: string) => void
  onOwnerChange?: (contractId: string, ownerId: string) => void
  onQueueChange?: (contractId: string, queue: Legal2Queue) => void
  onStatusChange?: (contractId: string, status: Legal2Status) => void
  onStatusFilterChange?: (status: Legal2Status | null) => void
  owners?: Legal2Person[]
  statusFilter?: Legal2Status | null
}
