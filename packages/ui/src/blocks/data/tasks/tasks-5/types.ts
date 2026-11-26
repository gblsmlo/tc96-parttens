import type {
  PeoplePropertyLabels,
  TagsPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PropertyTone } from '@tc96/ui/property-meta'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from '../../shared/collection/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Tasks5Mode = 'kanban' | 'list'

export type Tasks5Status = 'done' | 'in-progress' | 'todo'

export type Tasks5Priority = DataPriority

export type Tasks5PriorityFilter = Tasks5Priority | 'none'

export type Tasks5Sort = 'due' | 'priority' | 'project' | 'title' | 'updated'

export type Tasks5SortDirection = 'asc' | 'desc'

export type Tasks5SortColumn = Extract<Tasks5Sort, Tasks5ColumnId>

export type Tasks5GroupBy = 'priority' | 'project' | 'status'

export type Tasks5KanbanGroupBy = Extract<Tasks5GroupBy, 'priority' | 'status'>

export type Tasks5FilterId = 'assignee' | 'priority' | 'status'

export type Tasks5Person = DataCollectionPerson

export type Tasks5SavedView = DataCollectionSavedView

export interface Tasks5Option {
  id: string
  label: string
}

export interface Tasks5Tag extends Tasks5Option {
  tone: PropertyTone
}

export interface Tasks5Task {
  assigneeIds: string[]
  creatorId: string | null
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Tasks5Priority | null
  projectId: string | null
  status: Tasks5Status
  tagIds: string[]
  title: string
  updatedAt: string
}

export type Tasks5ColumnId =
  | 'assignees'
  | 'creator'
  | 'due'
  | 'priority'
  | 'project'
  | 'status'
  | 'tags'
  | 'title'
  | 'updated'

export interface Tasks5Labels extends DataCollectionLoadLabels {
  activeFilters: (count: number) => string
  changeStatus: (status: string) => string
  clearDate: string
  clearFilters: string
  clearSelection: string
  columns: Record<Tasks5ColumnId, string>
  complete: string
  create: string
  delete: string
  empty: string
  emptyColumn: string
  filter: string
  filterBy: Record<Tasks5FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Tasks5GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  layout: string
  layoutBy: string
  modes: Record<Tasks5Mode, string>
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
  priorities: Record<Tasks5Priority, string>
  selectedCount: (count: number) => string
  selectionActions: string
  selectAll: string
  selectTask: (title: string) => string
  sort: string
  sortBy: string
  sortColumn: (
    column: Tasks5SortColumn,
    direction: Tasks5SortDirection | null,
  ) => string
  sorts: Record<Tasks5Sort, string>
  status: string
  statuses: Record<Tasks5Status, string>
  title: string
  savedViews: DataCollectionSavedViewLabels
  toolbar: string
  viewList: string
  unassigned: string
}

type Tasks5LabelGroup =
  | 'columns'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'peoplePicker'
  | 'priorities'
  | 'savedViews'
  | 'sorts'
  | 'statuses'
  | 'tagPicker'

export type Tasks5LabelsOverride = Partial<
  Omit<Tasks5Labels, Tasks5LabelGroup>
> & {
  [TGroup in Tasks5LabelGroup]?: Partial<Tasks5Labels[TGroup]>
}

export interface Tasks5Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  assigneeFilter?: string | null
  className?: string
  collapsedGroupIds?: string[]
  filtered?: boolean
  groupBy?: Tasks5GroupBy | null
  labels?: Tasks5LabelsOverride
  mode?: Tasks5Mode
  now?: string
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks5Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks5Status) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onGroupByChange?: (groupBy: Tasks5GroupBy | null) => void
  onModeChange?: (mode: Tasks5Mode) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (taskId: string, priority: Tasks5Priority | null) => void
  onPriorityFilterChange?: (priority: Tasks5PriorityFilter | null) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Tasks5Sort, direction: Tasks5SortDirection) => void
  onStatusChange?: (taskId: string, status: Tasks5Status) => void
  onStatusFilterChange?: (status: Tasks5Status | null) => void
  people?: Tasks5Person[]
  priorityFilter?: Tasks5PriorityFilter | null
  projects?: Tasks5Option[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Tasks5SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Tasks5Sort
  sortDirection?: Tasks5SortDirection
  statusFilter?: Tasks5Status | null
  tags?: Tasks5Tag[]
  tasks: Tasks5Task[]
}
