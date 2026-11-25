import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionPerson,
  DataCollectionToolbarLabels,
} from '../../shared/collection/types'

export type Legal3Mode = 'calendar' | 'list' | 'table'

export type Legal3Kind = 'answer' | 'appeal' | 'filing' | 'hearing'

export type Legal3Queue = 'drafting' | 'filing' | 'intake' | 'review'

export type Legal3Status = 'done' | 'missed' | 'pending'

export type Legal3Person = DataCollectionPerson

export interface Legal3Deadline {
  allDay: boolean
  caseNumber: string
  caseTitle: string
  dueAt: string
  id: string
  kind: Legal3Kind
  ownerId: string | null
  queue: Legal3Queue
  status: Legal3Status
  title: string
}

export type Legal3ColumnId =
  | 'case'
  | 'deadline'
  | 'due'
  | 'kind'
  | 'owner'
  | 'queue'
  | 'status'

export interface Legal3Labels
  extends DataCollectionLoadLabels,
    DataCollectionToolbarLabels {
  columns: Record<Legal3ColumnId, string>
  empty: string
  kinds: Record<Legal3Kind, string>
  modes: DataCollectionModeLabels
  noDate: string
  openDeadline: (title: string) => string
  queues: Record<Legal3Queue, string>
  statuses: Record<Legal3Status, string>
  summary: (visible: number, pending: number) => string
  unassigned: string
}

export type Legal3LabelsOverride = Partial<
  Omit<Legal3Labels, 'columns' | 'kinds' | 'modes' | 'queues' | 'statuses'>
> & {
  columns?: Partial<Legal3Labels['columns']>
  kinds?: Partial<Legal3Labels['kinds']>
  modes?: Partial<Legal3Labels['modes']>
  queues?: Partial<Legal3Labels['queues']>
  statuses?: Partial<Legal3Labels['statuses']>
}

export interface Legal3Props
  extends DataCollectionFormatProps,
    DataCollectionLoadProps {
  anchor?: string
  className?: string
  deadlines: Legal3Deadline[]
  labels?: Legal3LabelsOverride
  mode?: Legal3Mode
  now?: string
  onCreate?: () => void
  onExport?: () => void
  onModeChange?: (mode: Legal3Mode) => void
  onOpen?: (deadlineId: string) => void
  onOwnerChange?: (deadlineId: string, ownerId: string) => void
  onQueueChange?: (deadlineId: string, queue: Legal3Queue) => void
  onStatusChange?: (deadlineId: string, status: Legal3Status) => void
  onStatusFilterChange?: (status: Legal3Status | null) => void
  owners?: Legal3Person[]
  statusFilter?: Legal3Status | null
}
