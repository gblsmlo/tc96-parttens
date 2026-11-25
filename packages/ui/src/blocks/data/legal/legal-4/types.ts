import type {
  LegalFormatProps,
  LegalLoadLabels,
  LegalLoadProps,
  LegalModeLabels,
  LegalPerson,
  LegalToolbarLabels,
} from '../shared/types'

export type Legal4Mode = 'list' | 'table'

export type Legal4Kind = 'company' | 'person'

export type Legal4Queue = 'billing' | 'onboarding' | 'relationship' | 'service'

export type Legal4Status = 'active' | 'defaulting' | 'inactive' | 'prospect'

export type Legal4Person = LegalPerson

export interface Legal4Contact {
  email: string
  name: string
}

export interface Legal4Client {
  activeCases: number
  clientSince: string | null
  contact: Legal4Contact | null
  contracts: number
  id: string
  kind: Legal4Kind
  name: string
  ownerId: string | null
  queue: Legal4Queue
  status: Legal4Status
}

export type Legal4ColumnId =
  | 'cases'
  | 'client'
  | 'contact'
  | 'contracts'
  | 'owner'
  | 'queue'
  | 'since'
  | 'status'

export interface Legal4Labels extends LegalLoadLabels, LegalToolbarLabels {
  activeCases: (count: number) => string
  columns: Record<Legal4ColumnId, string>
  contractCount: (count: number) => string
  empty: string
  kinds: Record<Legal4Kind, string>
  modes: LegalModeLabels
  noContact: string
  noDate: string
  openClient: (name: string) => string
  queues: Record<Legal4Queue, string>
  statuses: Record<Legal4Status, string>
  summary: (visible: number, active: number) => string
  unassigned: string
}

export type Legal4LabelsOverride = Partial<
  Omit<Legal4Labels, 'columns' | 'kinds' | 'modes' | 'queues' | 'statuses'>
> & {
  columns?: Partial<Legal4Labels['columns']>
  kinds?: Partial<Legal4Labels['kinds']>
  modes?: Partial<Legal4Labels['modes']>
  queues?: Partial<Legal4Labels['queues']>
  statuses?: Partial<Legal4Labels['statuses']>
}

export interface Legal4Props extends LegalFormatProps, LegalLoadProps {
  className?: string
  clients: Legal4Client[]
  labels?: Legal4LabelsOverride
  mode?: Legal4Mode
  onCreate?: () => void
  onExport?: () => void
  onModeChange?: (mode: Legal4Mode) => void
  onOpen?: (clientId: string) => void
  onOwnerChange?: (clientId: string, ownerId: string) => void
  onQueueChange?: (clientId: string, queue: Legal4Queue) => void
  onStatusChange?: (clientId: string, status: Legal4Status) => void
  onStatusFilterChange?: (status: Legal4Status | null) => void
  owners?: Legal4Person[]
  statusFilter?: Legal4Status | null
}
