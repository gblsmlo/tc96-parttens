import type {
  PeoplePropertyLabels,
  TagsPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PropertyMeta, PropertyTone } from '@tc96/ui/property-meta'
import type { ReactNode } from 'react'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from '../../shared/collection/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Tasks6Mode = 'kanban' | 'list'

export type Tasks6DefaultStatus = 'done' | 'in-progress' | 'todo'

export type Tasks6Status = string

export interface Tasks6StatusOption {
  id: Tasks6Status
  label: string
  meta: PropertyMeta
}

export type Tasks6Priority = DataPriority

export type Tasks6PriorityFilter = Tasks6Priority | 'none'

export type Tasks6DefaultSort =
  | 'due'
  | 'priority'
  | 'project'
  | 'title'
  | 'updated'

export type Tasks6Sort = string

export type Tasks6SortDirection = 'asc' | 'desc'

export type Tasks6SortColumn = Extract<Tasks6DefaultSort, Tasks6ColumnId>

export interface Tasks6SortOption {
  direction?: Tasks6SortDirection
  id: Tasks6Sort
  label: string
}

export type Tasks6KanbanGroupBy = 'priority' | 'status'

export type Tasks6FilterId = 'assignee' | 'priority' | 'status'

export type Tasks6Person = DataCollectionPerson

export type Tasks6SavedView = DataCollectionSavedView

export interface Tasks6Option {
  group?: string
  id: string
  label: string
}

export interface Tasks6Tag extends Tasks6Option {
  tone: PropertyTone
}

export interface Tasks6Task {
  assigneeIds: string[]
  creatorId?: string | null
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Tasks6Priority | null
  projectId?: string | null
  readOnly?: boolean
  status: Tasks6Status
  tagIds: string[]
  title: string
  updatedAt?: string
}

export type Tasks6ColumnId =
  | 'assignees'
  | 'creator'
  | 'due'
  | 'priority'
  | 'project'
  | 'status'
  | 'tags'
  | 'title'
  | 'updated'

export interface Tasks6Labels extends DataCollectionLoadLabels {
  changeStatus: (status: string) => string
  clearDate: string
  clearFilters: string
  clearSelection: string
  columns: Record<Tasks6ColumnId, string>
  complete: string
  create: string
  delete: string
  empty: string
  emptyColumn: string
  filterBy: Record<Tasks6FilterId, string>
  filterProperties: string
  display: string
  filterAll: Record<Tasks6FilterId, string>
  groupings: Record<Tasks6KanbanGroupBy, string>
  kanbanGroupBy: string
  layout: string
  modes: Record<Tasks6Mode, string>
  moreOptions: string
  moreTags: (count: number) => string
  noCreator: string
  noDue: string
  noPriority: string
  noProject: string
  noResult: string
  openTask: (title: string) => string
  peoplePicker: PeoplePropertyLabels
  tagPicker: TagsPropertyLabels
  priorities: Record<Tasks6Priority, string>
  selectedCount: (count: number) => string
  selectionActions: string
  selectAll: string
  selectTask: (title: string) => string
  sort: string
  sortBy: string
  sortColumn: (
    column: Tasks6SortColumn,
    direction: Tasks6SortDirection | null,
  ) => string
  sorts: Record<Tasks6DefaultSort, string>
  status: string
  statuses: Record<Tasks6DefaultStatus, string>
  title: string
  savedViews: DataCollectionSavedViewLabels
  toolbar: string
  viewList: string
  unassigned: string
}

type Tasks6LabelGroup =
  | 'columns'
  | 'filterAll'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'peoplePicker'
  | 'priorities'
  | 'savedViews'
  | 'sorts'
  | 'statuses'
  | 'tagPicker'

export type Tasks6LabelsOverride = Partial<
  Omit<Tasks6Labels, Tasks6LabelGroup>
> & {
  [TGroup in Tasks6LabelGroup]?: Partial<Tasks6Labels[TGroup]>
}

export interface Tasks6Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  actionBar?: ReactNode
  activeFilterCount?: number
  assigneeFilter?: string | null
  className?: string
  filtered?: boolean
  filters?: ReactNode
  footer?: ReactNode
  kanbanGroupBy?: Tasks6KanbanGroupBy
  labels?: Tasks6LabelsOverride
  mode?: Tasks6Mode
  now?: string
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks6Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks6Status) => void
  onClearFilters?: () => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onKanbanGroupByChange?: (groupBy: Tasks6KanbanGroupBy) => void
  onModeChange?: (mode: Tasks6Mode) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (taskId: string, priority: Tasks6Priority | null) => void
  onPriorityFilterChange?: (priority: Tasks6PriorityFilter | null) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Tasks6Sort, direction: Tasks6SortDirection) => void
  onStatusChange?: (taskId: string, status: Tasks6Status) => void
  onStatusFilterChange?: (status: Tasks6Status | null) => void
  people?: Tasks6Person[]
  priorityFilter?: Tasks6PriorityFilter | null
  projects?: Tasks6Option[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Tasks6SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Tasks6Sort
  sortDirection?: Tasks6SortDirection
  sortOptions?: readonly Tasks6SortOption[]
  statuses?: readonly Tasks6StatusOption[]
  statusFilter?: Tasks6Status | null
  tags?: Tasks6Tag[]
  tasks: Tasks6Task[]
}
