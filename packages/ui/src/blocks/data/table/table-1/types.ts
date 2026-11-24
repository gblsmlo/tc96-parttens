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
} from '../shared/types'

export type Table1Queue =
  | 'authentication'
  | 'billing'
  | 'integrations'
  | 'platform'

export type Table1Priority = 'high' | 'low' | 'medium' | 'urgent'

export type Table1Status = 'open' | 'pending' | 'resolved'

export type Table1SlaTone = 'breached' | 'closed' | 'healthy' | 'warning'

export type Table1Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type Table1ToggleColumnId =
  | 'priority'
  | 'queue'
  | 'requester'
  | 'sla'
  | 'status'

export type Table1ColumnId = Table1ToggleColumnId | 'actions' | 'ticket'

export type Table1SortKey = Exclude<Table1ColumnId, 'actions'>

export type Table1Person = TablePerson

export interface Table1Requester {
  company: string
  imageUrl?: string
  name: string
}

export interface Table1Sla {
  caption: string
  dueInMinutes: number | null
  label: string
  tone: Table1SlaTone
}

export interface Table1Ticket {
  code: string
  id: string
  opened: string
  ownerId: string | null
  priority: Table1Priority
  queue: Table1Queue
  requester: Table1Requester
  sla: Table1Sla
  status: Table1Status
  title: string
}

export interface Table1RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Table1View = TableView

export type Table1Sort = TableSort<Table1SortKey>

export type Table1ColumnVisibility = TableColumnVisibility<Table1ToggleColumnId>

export interface Table1Labels extends TableLoadLabels, TableViewLabels {
  allQueues: string
  allStatuses: string
  assignOwner: string
  clearFilters: string
  clearSelection: string
  columns: Record<Table1ColumnId, string>
  columnsMenu: string
  create: string
  density: string
  densities: Record<Table1Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  display: string
  empty: string
  export: string
  filters: string
  newStatus: string
  owner: string
  priorities: Record<Table1Priority, string>
  queue: string
  queues: Record<Table1Queue, string>
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
  statuses: Record<Table1Status, string>
  summary: (visible: number, unassigned: number, nearSla: number) => string
  title: string
  toolbar: string
  updateStatus: string
}

export type Table1LabelsOverride = Partial<
  Omit<
    Table1Labels,
    'columns' | 'densities' | 'priorities' | 'queues' | 'statuses'
  >
> & {
  columns?: Partial<Table1Labels['columns']>
  densities?: Partial<Table1Labels['densities']>
  priorities?: Partial<Table1Labels['priorities']>
  queues?: Partial<Table1Labels['queues']>
  statuses?: Partial<Table1Labels['statuses']>
}

export interface Table1Props
  extends TableFormatProps,
    TableLoadProps,
    TableViewProps {
  className?: string
  columnVisibility?: Table1ColumnVisibility
  density?: Table1Density
  labels?: Table1LabelsOverride
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: Table1ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: Table1Density) => void
  onExport?: () => void
  onPageSizeChange?: (pageSize: number) => void
  onQueueChange?: (queue: Table1Queue | null) => void
  onRowAction?: (actionId: string, ticketId: string) => void
  onSaveView?: () => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (ticketIds: string[]) => void
  onSortChange?: (sort: Table1Sort | null) => void
  onStatusChange?: (status: Table1Status | null) => void
  onStatusUpdate?: (ticketIds: string[], status: Table1Status) => void
  owners?: Table1Person[]
  pageSize?: number
  pageSizeOptions?: readonly number[]
  queue?: Table1Queue | null
  rowActions?: Table1RowAction[]
  search?: string
  selectedIds?: string[]
  sort?: Table1Sort | null
  status?: Table1Status | null
  tickets: Table1Ticket[]
}
