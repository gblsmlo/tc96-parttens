import type {
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
  GridSort,
} from '../../shared/grid/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Projects1View = 'active' | 'all' | 'backlog'

export type Projects1Status =
  | 'backlog'
  | 'done'
  | 'inProgress'
  | 'review'
  | 'todo'

export type Projects1Priority = DataPriority

export type Projects1ColumnId =
  | 'actions'
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type Projects1SortKey =
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type Projects1Person = GridPerson

export interface Projects1Task {
  assignee: Projects1Person
  id: string
  priority: Projects1Priority
  project: string
  status: Projects1Status
  subtasks?: Projects1Task[]
  title: string
}

export type Projects1Expanded = true | Record<string, boolean>

export type Projects1Sort = GridSort<Projects1SortKey>

export type Projects1ViewCounts = Record<Projects1View, number>

export interface Projects1RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Projects1Labels extends GridLoadLabels {
  allOptions: string
  clearFilters: string
  clearSort: string
  collapse: (task: string) => string
  columns: Record<Projects1ColumnId, string>
  columnsMenu: string
  create: string
  display: string
  empty: string
  expand: (task: string) => string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  priorities: Record<Projects1Priority, string>
  rowActionsFor: (task: string) => string
  rowsPerPage: string
  search: string
  settings: string
  showSubtasks: string
  sortBy: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  statuses: Record<Projects1Status, string>
  summary: (total: number, showSubtasks: boolean) => string
  title: string
  toolbar: string
  views: Record<Projects1View, string>
  viewsLabel: string
}

export type Projects1LabelsOverride = Partial<
  Omit<Projects1Labels, 'columns' | 'priorities' | 'statuses' | 'views'>
> & {
  columns?: Partial<Projects1Labels['columns']>
  priorities?: Partial<Projects1Labels['priorities']>
  statuses?: Partial<Projects1Labels['statuses']>
  views?: Partial<Projects1Labels['views']>
}

export interface Projects1Props extends GridLoadProps {
  className?: string
  expanded?: Projects1Expanded
  labels?: Projects1LabelsOverride
  onCreate?: () => void
  onExpandedChange?: (expanded: Projects1Expanded) => void
  onRowAction?: (actionId: string, taskId: string) => void
  onShowSubtasksChange?: (showSubtasks: boolean) => void
  onSortChange?: (sort: Projects1Sort | null) => void
  onViewChange?: (view: Projects1View) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  rowActions?: Projects1RowAction[]
  showSubtasks?: boolean
  sort?: Projects1Sort | null
  tasks: Projects1Task[]
  view?: Projects1View
  viewCounts?: Projects1ViewCounts
}
