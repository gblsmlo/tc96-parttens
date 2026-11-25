import type { DataPriority } from '../../shared/properties/data-priority'
import type {
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
  TableSort,
  TableView,
  TableViewLabels,
  TableViewProps,
} from '../../shared/table/types'

export type Support2Queue =
  | 'authentication'
  | 'billing'
  | 'integrations'
  | 'platform'

export type Support2Priority = DataPriority

export type Support2Status = 'open' | 'pending' | 'resolved'

export type Support2SlaTone = 'breached' | 'closed' | 'healthy' | 'warning'

export type Support2Density =
  | 'compact'
  | 'extra-tall'
  | 'medium'
  | 'short'
  | 'tall'

export type Support2ToggleColumnId =
  | 'priority'
  | 'queue'
  | 'requester'
  | 'sla'
  | 'status'

export type Support2ColumnId = Support2ToggleColumnId | 'actions' | 'ticket'

export type Support2SortKey = Exclude<Support2ColumnId, 'actions'>

export type Support2Person = TablePerson

export interface Support2Requester {
  company: string
  imageUrl?: string
  name: string
}

export interface Support2Sla {
  caption: string
  dueInMinutes: number | null
  label: string
  tone: Support2SlaTone
}

export interface Support2Ticket {
  code: string
  id: string
  opened: string
  ownerId: string | null
  priority: Support2Priority
  queue: Support2Queue
  requester: Support2Requester
  sla: Support2Sla
  status: Support2Status
  title: string
}

export interface Support2RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Support2View = TableView

export type Support2Sort = TableSort<Support2SortKey>

export type Support2ColumnVisibility =
  TableColumnVisibility<Support2ToggleColumnId>

export interface Support2Labels extends TableLoadLabels, TableViewLabels {
  allQueues: string
  allStatuses: string
  assignOwner: string
  clearFilters: string
  clearSelection: string
  columns: Record<Support2ColumnId, string>
  columnsMenu: string
  create: string
  density: string
  densities: Record<Support2Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  display: string
  empty: string
  export: string
  filters: string
  newStatus: string
  owner: string
  priorities: Record<Support2Priority, string>
  queue: string
  queues: Record<Support2Queue, string>
  rowActionsFor: (ticket: string) => string
  rowsPerPage: string
  saveView: string
  search: string
  selectAll: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectTicket: (ticket: string) => string
  sortBy: string
  status: string
  statuses: Record<Support2Status, string>
  summary: (visible: number, unassigned: number, nearSla: number) => string
  title: string
  toolbar: string
  updateStatus: string
}

export type Support2LabelsOverride = Partial<
  Omit<
    Support2Labels,
    'columns' | 'densities' | 'priorities' | 'queues' | 'statuses'
  >
> & {
  columns?: Partial<Support2Labels['columns']>
  densities?: Partial<Support2Labels['densities']>
  priorities?: Partial<Support2Labels['priorities']>
  queues?: Partial<Support2Labels['queues']>
  statuses?: Partial<Support2Labels['statuses']>
}

export interface Support2Props
  extends TableFormatProps,
    TableLoadProps,
    TableViewProps {
  className?: string
  columnVisibility?: Support2ColumnVisibility
  density?: Support2Density
  labels?: Support2LabelsOverride
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: Support2ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: Support2Density) => void
  onExport?: () => void
  onPageSizeChange?: (pageSize: number) => void
  onQueueChange?: (queue: Support2Queue | null) => void
  onRowAction?: (actionId: string, ticketId: string) => void
  onSaveView?: () => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (ticketIds: string[]) => void
  onSortChange?: (sort: Support2Sort | null) => void
  onStatusChange?: (status: Support2Status | null) => void
  onStatusUpdate?: (ticketIds: string[], status: Support2Status) => void
  owners?: Support2Person[]
  pageSize?: number
  pageSizeOptions?: readonly number[]
  queue?: Support2Queue | null
  rowActions?: Support2RowAction[]
  search?: string
  selectedIds?: string[]
  sort?: Support2Sort | null
  status?: Support2Status | null
  tickets: Support2Ticket[]
}
