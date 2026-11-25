import type { DataPriority } from '../../shared/properties/data-priority'
import type {
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
  TableSort,
} from '../../shared/table/types'

export type Projects2View = 'active' | 'all' | 'backlog'

export type Projects2Status =
  | 'backlog'
  | 'done'
  | 'inProgress'
  | 'review'
  | 'todo'

export type Projects2Priority = DataPriority

export type Projects2ColumnId =
  | 'actions'
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type Projects2SortKey =
  | 'assignee'
  | 'priority'
  | 'project'
  | 'status'
  | 'task'

export type Projects2Person = TablePerson

export interface Projects2Task {
  assignee: Projects2Person
  id: string
  priority: Projects2Priority
  project: string
  status: Projects2Status
  subtasks?: Projects2Task[]
  title: string
}

export type Projects2Expanded = true | Record<string, boolean>

export type Projects2Sort = TableSort<Projects2SortKey>

export type Projects2ViewCounts = Record<Projects2View, number>

export interface Projects2RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Projects2Labels extends TableLoadLabels {
  allOptions: string
  clearFilters: string
  clearSort: string
  collapse: (task: string) => string
  columns: Record<Projects2ColumnId, string>
  columnsMenu: string
  create: string
  display: string
  empty: string
  expand: (task: string) => string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  priorities: Record<Projects2Priority, string>
  rowActionsFor: (task: string) => string
  rowsPerPage: string
  search: string
  settings: string
  showSubtasks: string
  sortBy: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  statuses: Record<Projects2Status, string>
  summary: (total: number, showSubtasks: boolean) => string
  title: string
  toolbar: string
  views: Record<Projects2View, string>
  viewsLabel: string
}

export type Projects2LabelsOverride = Partial<
  Omit<Projects2Labels, 'columns' | 'priorities' | 'statuses' | 'views'>
> & {
  columns?: Partial<Projects2Labels['columns']>
  priorities?: Partial<Projects2Labels['priorities']>
  statuses?: Partial<Projects2Labels['statuses']>
  views?: Partial<Projects2Labels['views']>
}

export interface Projects2Props extends TableLoadProps {
  className?: string
  expanded?: Projects2Expanded
  labels?: Projects2LabelsOverride
  onCreate?: () => void
  onExpandedChange?: (expanded: Projects2Expanded) => void
  onRowAction?: (actionId: string, taskId: string) => void
  onShowSubtasksChange?: (showSubtasks: boolean) => void
  onSortChange?: (sort: Projects2Sort | null) => void
  onViewChange?: (view: Projects2View) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  rowActions?: Projects2RowAction[]
  showSubtasks?: boolean
  sort?: Projects2Sort | null
  tasks: Projects2Task[]
  view?: Projects2View
  viewCounts?: Projects2ViewCounts
}
