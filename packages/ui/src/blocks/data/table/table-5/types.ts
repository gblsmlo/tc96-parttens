import type {
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
  TableSort,
} from '../shared/types'

export type Table5View = 'active' | 'all' | 'backlog'

export type Table5Status = 'backlog' | 'done' | 'inProgress' | 'review' | 'todo'

export type Table5Priority = 'high' | 'low' | 'medium' | 'urgent'

export type Table5ColumnId =
  | 'actions'
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type Table5SortKey =
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type Table5Person = TablePerson

export interface Table5Task {
  assignee: Table5Person
  id: string
  priority: Table5Priority
  project: string
  status: Table5Status
  subtasks?: Table5Task[]
  title: string
}

export type Table5Expanded = true | Record<string, boolean>

export type Table5Sort = TableSort<Table5SortKey>

export type Table5ViewCounts = Record<Table5View, number>

export interface Table5RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Table5Labels extends TableLoadLabels {
  allOptions: string
  clearFilters: string
  clearSort: string
  collapse: (task: string) => string
  columns: Record<Table5ColumnId, string>
  columnsMenu: string
  create: string
  display: string
  empty: string
  expand: (task: string) => string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  priorities: Record<Table5Priority, string>
  rowActionsFor: (task: string) => string
  rowsPerPage: string
  search: string
  settings: string
  showSubtasks: string
  sortBy: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  statuses: Record<Table5Status, string>
  summary: (total: number, showSubtasks: boolean) => string
  title: string
  toolbar: string
  views: Record<Table5View, string>
  viewsLabel: string
}

export type Table5LabelsOverride = Partial<
  Omit<Table5Labels, 'columns' | 'priorities' | 'statuses' | 'views'>
> & {
  columns?: Partial<Table5Labels['columns']>
  priorities?: Partial<Table5Labels['priorities']>
  statuses?: Partial<Table5Labels['statuses']>
  views?: Partial<Table5Labels['views']>
}

export interface Table5Props extends TableLoadProps {
  className?: string
  expanded?: Table5Expanded
  labels?: Table5LabelsOverride
  onCreate?: () => void
  onExpandedChange?: (expanded: Table5Expanded) => void
  onRowAction?: (actionId: string, taskId: string) => void
  onShowSubtasksChange?: (showSubtasks: boolean) => void
  onSortChange?: (sort: Table5Sort | null) => void
  onViewChange?: (view: Table5View) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  rowActions?: Table5RowAction[]
  showSubtasks?: boolean
  sort?: Table5Sort | null
  tasks: Table5Task[]
  view?: Table5View
  viewCounts?: Table5ViewCounts
}
