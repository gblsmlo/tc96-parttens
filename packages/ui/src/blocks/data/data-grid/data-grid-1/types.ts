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
} from '../shared/types'

export type DataGrid1Queue =
  | 'authentication'
  | 'billing'
  | 'integrations'
  | 'platform'

export type DataGrid1Priority = 'high' | 'low' | 'medium' | 'urgent'

export type DataGrid1Status = 'open' | 'pending' | 'resolved'

export type DataGrid1SlaTone = 'breached' | 'closed' | 'healthy' | 'warning'

export type DataGrid1Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type DataGrid1ToggleColumnId =
  | 'priority'
  | 'queue'
  | 'requester'
  | 'sla'
  | 'status'

export type DataGrid1ColumnId = DataGrid1ToggleColumnId | 'actions' | 'ticket'

export type DataGrid1SortKey = Exclude<DataGrid1ColumnId, 'actions'>

export type DataGrid1Person = GridPerson

export interface DataGrid1Requester {
  company: string
  imageUrl?: string
  name: string
}

export interface DataGrid1Sla {
  caption: string
  dueInMinutes: number | null
  label: string
  tone: DataGrid1SlaTone
}

export interface DataGrid1Ticket {
  code: string
  id: string
  opened: string
  ownerId: string | null
  priority: DataGrid1Priority
  queue: DataGrid1Queue
  requester: DataGrid1Requester
  sla: DataGrid1Sla
  status: DataGrid1Status
  title: string
}

export interface DataGrid1RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type DataGrid1View = GridView

export type DataGrid1Sort = GridSort<DataGrid1SortKey>

export type DataGrid1ColumnVisibility =
  GridColumnVisibility<DataGrid1ToggleColumnId>

export interface DataGrid1Labels extends GridLoadLabels, GridViewLabels {
  allQueues: string
  allStatuses: string
  assignOwner: string
  clearFilters: string
  clearSelection: string
  columns: Record<DataGrid1ColumnId, string>
  columnsMenu: string
  create: string
  density: string
  densities: Record<DataGrid1Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  display: string
  empty: string
  export: string
  filters: string
  newStatus: string
  owner: string
  priorities: Record<DataGrid1Priority, string>
  queue: string
  queues: Record<DataGrid1Queue, string>
  rowActionsFor: (ticket: string) => string
  rowsPerPage: string
  saveView: string
  selectAll: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectTicket: (ticket: string) => string
  sortBy: string
  status: string
  statuses: Record<DataGrid1Status, string>
  summary: (visible: number, unassigned: number, nearSla: number) => string
  title: string
  toolbar: string
  updateStatus: string
}

export type DataGrid1LabelsOverride = Partial<
  Omit<
    DataGrid1Labels,
    'columns' | 'densities' | 'priorities' | 'queues' | 'statuses'
  >
> & {
  columns?: Partial<DataGrid1Labels['columns']>
  densities?: Partial<DataGrid1Labels['densities']>
  priorities?: Partial<DataGrid1Labels['priorities']>
  queues?: Partial<DataGrid1Labels['queues']>
  statuses?: Partial<DataGrid1Labels['statuses']>
}

export interface DataGrid1Props
  extends GridFormatProps,
    GridLoadProps,
    GridViewProps {
  className?: string
  columnVisibility?: DataGrid1ColumnVisibility
  density?: DataGrid1Density
  labels?: DataGrid1LabelsOverride
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: DataGrid1ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: DataGrid1Density) => void
  onExport?: () => void
  onPageSizeChange?: (pageSize: number) => void
  onQueueChange?: (queue: DataGrid1Queue | null) => void
  onRowAction?: (actionId: string, ticketId: string) => void
  onSaveView?: () => void
  onSelectedIdsChange?: (ticketIds: string[]) => void
  onSortChange?: (sort: DataGrid1Sort | null) => void
  onStatusChange?: (status: DataGrid1Status | null) => void
  onStatusUpdate?: (ticketIds: string[], status: DataGrid1Status) => void
  owners?: DataGrid1Person[]
  pageSize?: number
  pageSizeOptions?: readonly number[]
  queue?: DataGrid1Queue | null
  rowActions?: DataGrid1RowAction[]
  selectedIds?: string[]
  sort?: DataGrid1Sort | null
  status?: DataGrid1Status | null
  tickets: DataGrid1Ticket[]
}
