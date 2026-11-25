import type {
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
  GridSort,
  GridView,
  GridViewLabels,
  GridViewProps,
} from '../../shared/grid/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Support1Queue =
  | 'authentication'
  | 'billing'
  | 'integrations'
  | 'platform'

export type Support1Priority = DataPriority

export type Support1Status = 'open' | 'pending' | 'resolved'

export type Support1SlaTone = 'breached' | 'closed' | 'healthy' | 'warning'

export type Support1Density =
  | 'compact'
  | 'extra-tall'
  | 'medium'
  | 'short'
  | 'tall'

export type Support1ToggleColumnId =
  | 'priority'
  | 'queue'
  | 'requester'
  | 'sla'
  | 'status'

export type Support1ColumnId = Support1ToggleColumnId | 'actions' | 'ticket'

export type Support1SortKey = Exclude<Support1ColumnId, 'actions'>

export type Support1Person = GridPerson

export interface Support1Requester {
  company: string
  imageUrl?: string
  name: string
}

export interface Support1Sla {
  caption: string
  dueInMinutes: number | null
  label: string
  tone: Support1SlaTone
}

export interface Support1Ticket {
  code: string
  id: string
  opened: string
  ownerId: string | null
  priority: Support1Priority
  queue: Support1Queue
  requester: Support1Requester
  sla: Support1Sla
  status: Support1Status
  title: string
}

export interface Support1RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Support1View = GridView

export type Support1Sort = GridSort<Support1SortKey>

export type Support1ColumnVisibility =
  GridColumnVisibility<Support1ToggleColumnId>

export interface Support1Labels extends GridLoadLabels, GridViewLabels {
  allQueues: string
  allStatuses: string
  assignOwner: string
  clearFilters: string
  clearSelection: string
  columns: Record<Support1ColumnId, string>
  columnsMenu: string
  create: string
  density: string
  densities: Record<Support1Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  display: string
  empty: string
  export: string
  filters: string
  newStatus: string
  owner: string
  priorities: Record<Support1Priority, string>
  queue: string
  queues: Record<Support1Queue, string>
  rowActionsFor: (ticket: string) => string
  rowsPerPage: string
  saveView: string
  selectAll: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectTicket: (ticket: string) => string
  sortBy: string
  status: string
  statuses: Record<Support1Status, string>
  summary: (visible: number, unassigned: number, nearSla: number) => string
  title: string
  toolbar: string
  updateStatus: string
}

export type Support1LabelsOverride = Partial<
  Omit<
    Support1Labels,
    'columns' | 'densities' | 'priorities' | 'queues' | 'statuses'
  >
> & {
  columns?: Partial<Support1Labels['columns']>
  densities?: Partial<Support1Labels['densities']>
  priorities?: Partial<Support1Labels['priorities']>
  queues?: Partial<Support1Labels['queues']>
  statuses?: Partial<Support1Labels['statuses']>
}

export interface Support1Props
  extends GridFormatProps,
    GridLoadProps,
    GridViewProps {
  className?: string
  columnVisibility?: Support1ColumnVisibility
  density?: Support1Density
  labels?: Support1LabelsOverride
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: Support1ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: Support1Density) => void
  onExport?: () => void
  onPageSizeChange?: (pageSize: number) => void
  onQueueChange?: (queue: Support1Queue | null) => void
  onRowAction?: (actionId: string, ticketId: string) => void
  onSaveView?: () => void
  onSelectedIdsChange?: (ticketIds: string[]) => void
  onSortChange?: (sort: Support1Sort | null) => void
  onStatusChange?: (status: Support1Status | null) => void
  onStatusUpdate?: (ticketIds: string[], status: Support1Status) => void
  owners?: Support1Person[]
  pageSize?: number
  pageSizeOptions?: readonly number[]
  queue?: Support1Queue | null
  rowActions?: Support1RowAction[]
  selectedIds?: string[]
  sort?: Support1Sort | null
  status?: Support1Status | null
  tickets: Support1Ticket[]
}
