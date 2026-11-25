import type {
  LegalFormatProps,
  LegalLoadLabels,
  LegalLoadProps,
  LegalModeLabels,
  LegalPerson,
  LegalToolbarLabels,
} from '../shared/types'

export type Legal1Mode = 'kanban' | 'list' | 'table'

export type Legal1Kind = 'lawsuit' | 'matter'

export type Legal1View = 'all' | 'lawsuits' | 'matters'

export type Legal1Area = 'civil' | 'consumer' | 'corporate' | 'labor' | 'tax'

export type Legal1Phase =
  | 'appeal'
  | 'enforcement'
  | 'evidence'
  | 'filing'
  | 'judgment'

export type Legal1Queue = 'drafting' | 'hearings' | 'intake' | 'review'

export type Legal1Status = 'active' | 'closed' | 'settled' | 'suspended'

export type Legal1Person = LegalPerson

export interface Legal1Case {
  area: Legal1Area
  client: string
  court: string | null
  id: string
  instance: string | null
  kind: Legal1Kind
  nextDeadline: string | null
  number: string | null
  ownerId: string | null
  phase: Legal1Phase
  queue: Legal1Queue
  status: Legal1Status
  title: string
}

export type Legal1ColumnId =
  | 'area'
  | 'client'
  | 'court'
  | 'deadline'
  | 'number'
  | 'owner'
  | 'phase'
  | 'queue'
  | 'status'
  | 'title'

export interface Legal1Labels extends LegalLoadLabels, LegalToolbarLabels {
  areas: Record<Legal1Area, string>
  columns: Record<Legal1ColumnId, string>
  copyNumber: string
  empty: string
  emptyColumn: string
  modes: LegalModeLabels
  noCourt: string
  noDeadline: string
  noNumber: string
  openCase: (title: string) => string
  phases: Record<Legal1Phase, string>
  queues: Record<Legal1Queue, string>
  statuses: Record<Legal1Status, string>
  unassigned: string
  viewList: string
  views: Record<Legal1View, string>
}

export type Legal1LabelsOverride = Partial<
  Omit<
    Legal1Labels,
    'areas' | 'columns' | 'modes' | 'phases' | 'queues' | 'statuses' | 'views'
  >
> & {
  areas?: Partial<Legal1Labels['areas']>
  columns?: Partial<Legal1Labels['columns']>
  modes?: Partial<Legal1Labels['modes']>
  phases?: Partial<Legal1Labels['phases']>
  queues?: Partial<Legal1Labels['queues']>
  statuses?: Partial<Legal1Labels['statuses']>
  views?: Partial<Legal1Labels['views']>
}

export interface Legal1Props extends LegalFormatProps, LegalLoadProps {
  cases: Legal1Case[]
  className?: string
  labels?: Legal1LabelsOverride
  mode?: Legal1Mode
  onCreate?: () => void
  onExport?: () => void
  onModeChange?: (mode: Legal1Mode) => void
  onOpen?: (caseId: string) => void
  onOwnerChange?: (caseId: string, ownerId: string) => void
  onPhaseChange?: (caseId: string, phase: Legal1Phase) => void
  onQueueChange?: (caseId: string, queue: Legal1Queue) => void
  onStatusChange?: (caseId: string, status: Legal1Status) => void
  onStatusFilterChange?: (status: Legal1Status | null) => void
  onViewChange?: (view: Legal1View) => void
  owners?: Legal1Person[]
  statusFilter?: Legal1Status | null
  view?: Legal1View
}
