import type {
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
  GridSort,
} from '../shared/types'

export type DataGrid5View = 'active' | 'all' | 'backlog'

export type DataGrid5Status =
  | 'backlog'
  | 'done'
  | 'inProgress'
  | 'review'
  | 'todo'

export type DataGrid5Priority = 'high' | 'low' | 'medium' | 'urgent'

export type DataGrid5ColumnId =
  | 'actions'
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type DataGrid5SortKey =
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type DataGrid5Person = GridPerson

export interface DataGrid5Task {
  assignee: DataGrid5Person
  id: string
  priority: DataGrid5Priority
  project: string
  status: DataGrid5Status
  subtasks?: DataGrid5Task[]
  title: string
}

export type DataGrid5Expanded = true | Record<string, boolean>

export type DataGrid5Sort = GridSort<DataGrid5SortKey>

export type DataGrid5ViewCounts = Record<DataGrid5View, number>

export interface DataGrid5RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface DataGrid5Labels extends GridLoadLabels {
  allOptions: string
  clearFilters: string
  clearSort: string
  collapse: (task: string) => string
  columns: Record<DataGrid5ColumnId, string>
  columnsMenu: string
  create: string
  display: string
  empty: string
  expand: (task: string) => string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  priorities: Record<DataGrid5Priority, string>
  rowActionsFor: (task: string) => string
  rowsPerPage: string
  search: string
  settings: string
  showSubtasks: string
  sortBy: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  statuses: Record<DataGrid5Status, string>
  summary: (total: number, showSubtasks: boolean) => string
  title: string
  toolbar: string
  views: Record<DataGrid5View, string>
  viewsLabel: string
}

export type DataGrid5LabelsOverride = Partial<
  Omit<DataGrid5Labels, 'columns' | 'priorities' | 'statuses' | 'views'>
> & {
  columns?: Partial<DataGrid5Labels['columns']>
  priorities?: Partial<DataGrid5Labels['priorities']>
  statuses?: Partial<DataGrid5Labels['statuses']>
  views?: Partial<DataGrid5Labels['views']>
}

export interface DataGrid5Props extends GridLoadProps {
  className?: string
  expanded?: DataGrid5Expanded
  labels?: DataGrid5LabelsOverride
  onCreate?: () => void
  onExpandedChange?: (expanded: DataGrid5Expanded) => void
  onRowAction?: (actionId: string, taskId: string) => void
  onShowSubtasksChange?: (showSubtasks: boolean) => void
  onSortChange?: (sort: DataGrid5Sort | null) => void
  onViewChange?: (view: DataGrid5View) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  rowActions?: DataGrid5RowAction[]
  showSubtasks?: boolean
  sort?: DataGrid5Sort | null
  tasks: DataGrid5Task[]
  view?: DataGrid5View
  viewCounts?: DataGrid5ViewCounts
}
