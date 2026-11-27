import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import type { PeoplePropertyLabels } from '@tc96/ui/patterns/properties/core'
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

export interface Tasks6SortOption {
  icon?: PhosphorIcon
  id: Tasks6Sort
  label: string
}

export type Tasks6SortDirection = 'asc' | 'desc'

export type Tasks6SortColumn = Extract<Tasks6DefaultSort, Tasks6ColumnId>

export type Tasks6GroupBy = 'priority' | 'project' | 'status'

export type Tasks6KanbanGroupBy = Extract<Tasks6GroupBy, 'priority' | 'status'>

export type Tasks6FilterId = 'assignee' | 'priority' | 'status'

export type Tasks6Person = DataCollectionPerson

export type Tasks6SavedView = DataCollectionSavedView

export type Tasks6ChangeResult = boolean | Promise<boolean> | undefined | void

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
  description?: string | null
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Tasks6Priority | null
  projectId?: string | null
  readOnly?: boolean
  startAt?: string | null
  status: Tasks6Status
  tagIds: string[]
  title: string
  typeId?: string | null
  updatedAt?: string
}

export type Tasks6FieldId =
  | 'assignees'
  | 'due'
  | 'priority'
  | 'project'
  | 'start'
  | 'status'
  | 'type'
  | 'updated'

export type Tasks6ColumnId = Tasks6FieldId | 'creator' | 'tags' | 'title'

export interface Tasks6Labels extends DataCollectionLoadLabels {
  activeFilters: (count: number) => string
  clearDate: string
  clearFilters: string
  clearSelection: string
  columns: Record<Tasks6ColumnId, string>
  complete: string
  create: string
  defaultView: string
  delete: string
  empty: string
  emptyColumn: string
  filter: string
  filterBy: Record<Tasks6FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Tasks6GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  layout: string
  layoutBy: string
  modes: Record<Tasks6Mode, string>
  visibility: string
  moreOptions: string
  moreTags: (count: number) => string
  noCreator: string
  noDue: string
  noPriority: string
  noProject: string
  noResult: string
  noStart: string
  noType: string
  openTask: (title: string) => string
  overdue: (date: string) => string
  peoplePicker: PeoplePropertyLabels
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
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'peoplePicker'
  | 'priorities'
  | 'savedViews'
  | 'sorts'
  | 'statuses'

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
  collapsedGroupIds?: string[]
  completeStatus?: Tasks6Status
  fields?: readonly Tasks6FieldId[]
  filtered?: boolean
  filters?: ReactNode
  footer?: ReactNode
  groupBy?: Tasks6GroupBy | null
  groupBys?: readonly Tasks6GroupBy[]
  kanbanFields?: readonly Tasks6FieldId[]
  kanbanGroupBys?: readonly Tasks6KanbanGroupBy[]
  kanbanMoveGroupBys?: readonly Tasks6KanbanGroupBy[]
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
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onGroupByChange?: (groupBy: Tasks6GroupBy | null) => void
  onModeChange?: (mode: Tasks6Mode) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (
    taskId: string,
    priority: Tasks6Priority | null,
  ) => Tasks6ChangeResult
  onPriorityFilterChange?: (priority: Tasks6PriorityFilter | null) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Tasks6Sort, direction: Tasks6SortDirection) => void
  onStartChange?: (taskId: string, day: string) => void
  onStatusChange?: (taskId: string, status: Tasks6Status) => Tasks6ChangeResult
  onStatusFilterChange?: (status: Tasks6Status | null) => void
  onTypeChange?: (taskId: string, typeId: string) => void
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
  types?: readonly Tasks6Option[]
}
