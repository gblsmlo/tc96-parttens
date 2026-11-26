import type { PeoplePropertyLabels } from '@tc96/ui/patterns/properties/core'
import type { PropertyTone } from '@tc96/ui/property-meta'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
} from '../../shared/collection/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Tasks3Mode = 'kanban' | 'list'

export type Tasks3Status = 'done' | 'in-progress' | 'todo'

export type Tasks3Priority = DataPriority

export type Tasks3PriorityFilter = Tasks3Priority | 'none'

export type Tasks3Sort = 'due' | 'priority' | 'project' | 'title' | 'updated'

export type Tasks3SortDirection = 'asc' | 'desc'

export type Tasks3SortColumn = Extract<Tasks3Sort, Tasks3ColumnId>

export type Tasks3GroupBy = 'priority' | 'project' | 'status'

export type Tasks3KanbanGroupBy = Extract<Tasks3GroupBy, 'priority' | 'status'>

export type Tasks3FilterId = 'assignee' | 'priority' | 'status'

export type Tasks3Person = DataCollectionPerson

export interface Tasks3Option {
  id: string
  label: string
}

export interface Tasks3Tag extends Tasks3Option {
  tone: PropertyTone
}

export interface Tasks3Task {
  assigneeIds: string[]
  creatorId: string | null
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Tasks3Priority | null
  projectId: string | null
  status: Tasks3Status
  tagIds: string[]
  title: string
  updatedAt: string
}

export type Tasks3ColumnId =
  | 'assignees'
  | 'creator'
  | 'due'
  | 'priority'
  | 'project'
  | 'status'
  | 'tags'
  | 'title'
  | 'updated'

export interface Tasks3Labels extends DataCollectionLoadLabels {
  activeFilters: (count: number) => string
  clearDate: string
  clearFilters: string
  clearSelection: string
  columns: Record<Tasks3ColumnId, string>
  complete: string
  create: string
  delete: string
  empty: string
  emptyColumn: string
  filter: string
  filterBy: Record<Tasks3FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Tasks3GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  layout: string
  layoutBy: string
  modes: Record<Tasks3Mode, string>
  moreOptions: string
  moreTags: (count: number) => string
  noCreator: string
  noDue: string
  noPriority: string
  noProject: string
  noResult: string
  openTask: (title: string) => string
  peoplePicker: PeoplePropertyLabels
  priorities: Record<Tasks3Priority, string>
  search: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectAll: string
  selectTask: (title: string) => string
  sort: string
  sortBy: string
  sortColumn: (
    column: Tasks3SortColumn,
    direction: Tasks3SortDirection | null,
  ) => string
  sorts: Record<Tasks3Sort, string>
  status: string
  statuses: Record<Tasks3Status, string>
  title: string
  toolbar: string
  unassigned: string
}

type Tasks3LabelGroup =
  | 'columns'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'peoplePicker'
  | 'priorities'
  | 'sorts'
  | 'statuses'

export type Tasks3LabelsOverride = Partial<
  Omit<Tasks3Labels, Tasks3LabelGroup>
> & {
  [TGroup in Tasks3LabelGroup]?: Partial<Tasks3Labels[TGroup]>
}

export interface Tasks3Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  assigneeFilter?: string | null
  className?: string
  collapsedGroupIds?: string[]
  filtered?: boolean
  groupBy?: Tasks3GroupBy | null
  labels?: Tasks3LabelsOverride
  mode?: Tasks3Mode
  now?: string
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks3Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks3Status) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onGroupByChange?: (groupBy: Tasks3GroupBy | null) => void
  onModeChange?: (mode: Tasks3Mode) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (taskId: string, priority: Tasks3Priority | null) => void
  onPriorityFilterChange?: (priority: Tasks3PriorityFilter | null) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Tasks3Sort, direction: Tasks3SortDirection) => void
  onStatusChange?: (taskId: string, status: Tasks3Status) => void
  onStatusFilterChange?: (status: Tasks3Status | null) => void
  people?: Tasks3Person[]
  priorityFilter?: Tasks3PriorityFilter | null
  projects?: Tasks3Option[]
  search?: string
  selectedIds?: string[]
  sort?: Tasks3Sort
  sortDirection?: Tasks3SortDirection
  statusFilter?: Tasks3Status | null
  tags?: Tasks3Tag[]
  tasks: Tasks3Task[]
}
