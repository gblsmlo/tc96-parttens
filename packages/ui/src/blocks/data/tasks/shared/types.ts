import type { CollectionLayout } from '@tc96/ui/patterns/collection/core'
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

export type TasksMode = Extract<
  CollectionLayout,
  'datatable' | 'kanban' | 'list'
>

export type TasksStatus = 'canceled' | 'done' | 'in-progress' | 'todo'

export type TasksPriority = DataPriority

export type TasksPriorityFilter = TasksPriority | 'none'

export type TasksSort = 'due' | 'priority' | 'kind' | 'title' | 'updated'

export type TasksSortDirection = 'asc' | 'desc'

export type TasksGroupBy = 'priority' | 'kind' | 'status'

export type TasksKanbanGroupBy = Extract<TasksGroupBy, 'priority' | 'status'>

export type TasksFilterId = 'assignee' | 'priority' | 'kind' | 'status'

export type TasksColumnId =
  | 'assignees'
  | 'creator'
  | 'due'
  | 'priority'
  | 'kind'
  | 'status'
  | 'tags'
  | 'title'
  | 'updated'

export type TasksSortColumn = Extract<TasksSort, TasksColumnId>

export type TasksPerson = DataCollectionPerson

export type TasksSavedView = DataCollectionSavedView

export interface TasksOption {
  id: string
  label: string
}

export interface TasksTag extends TasksOption {
  tone: PropertyTone
}

export interface TasksTask {
  assigneeIds: string[]
  creatorId: string | null
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: TasksPriority | null
  kindId: string | null
  status: TasksStatus
  tagIds: string[]
  title: string
  updatedAt: string
}

export interface TasksVocabularyLabels {
  columns: Record<TasksColumnId, string>
  filterBy: Record<TasksFilterId, string>
  groupings: Record<TasksGroupBy | 'none', string>
  modes: Record<TasksMode, string>
  peoplePicker: PeoplePropertyLabels
  priorities: Record<TasksPriority, string>
  savedViews: DataCollectionSavedViewLabels
  sorts: Record<TasksSort, string>
  statuses: Record<TasksStatus, string>
  tagPicker: TagsPropertyLabels
}

export interface TasksLabels
  extends DataCollectionLoadLabels,
    TasksVocabularyLabels {
  activeFilters: (count: number) => string
  changeStatus: (status: string) => string
  clearDate: string
  clearFilters: string
  clearSelection: string
  complete: string
  create: string
  delete: string
  empty: string
  emptyColumn: string
  filter: string
  group: string
  groupBy: string
  groupToggle: (group: string, collapsed: boolean) => string
  layout: string
  layoutBy: string
  moreOptions: string
  moreTags: (count: number) => string
  noCreator: string
  noDue: string
  noPriority: string
  noKind: string
  noResult: string
  openTask: (title: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  selectAll: string
  selectTask: (title: string) => string
  sort: string
  sortBy: string
  sortColumn: (
    column: TasksSortColumn,
    direction: TasksSortDirection | null,
  ) => string
  status: string
  title: string
  toolbar: string
  unassigned: string
  viewList: string
  visibleColumns: string
}

export type TasksLabelsOverride<TLabels extends TasksLabels = TasksLabels> =
  Partial<Omit<TLabels, keyof TasksVocabularyLabels>> & {
    [TGroup in keyof TasksVocabularyLabels]?: Partial<TLabels[TGroup]>
  }

export interface TasksDataProps {
  people?: TasksPerson[]
  kinds?: TasksOption[]
  tags?: TasksTag[]
  tasks: TasksTask[]
}

export interface TasksViewBuilderProps {
  filters?: readonly TasksFilterId[]
  groupBys?: readonly TasksGroupBy[]
  modes?: readonly TasksMode[]
  onVisibleColumnsChange?: (columns: TasksColumnId[]) => void
  sorts?: readonly TasksSort[]
  visibleColumns?: readonly TasksColumnId[]
}

export interface TasksViewStateProps {
  collapsedGroupIds?: string[]
  groupBy?: TasksGroupBy | null
  mode?: TasksMode
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onGroupByChange?: (groupBy: TasksGroupBy | null) => void
  onModeChange?: (mode: TasksMode) => void
  onSortChange?: (sort: TasksSort, direction: TasksSortDirection) => void
  sort?: TasksSort
  sortDirection?: TasksSortDirection
}

export interface TasksFilterProps {
  assigneeFilter?: string | null
  filtered?: boolean
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onPriorityFilterChange?: (priority: TasksPriorityFilter | null) => void
  onKindFilterChange?: (kindId: string | null) => void
  onStatusFilterChange?: (status: TasksStatus | null) => void
  priorityFilter?: TasksPriorityFilter | null
  kindFilter?: string | null
  statusFilter?: TasksStatus | null
}

export interface TasksActionProps {
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (taskId: string, priority: TasksPriority | null) => void
  onKindChange?: (taskId: string, kindId: string | null) => void
  onStatusChange?: (taskId: string, status: TasksStatus) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
}

export interface TasksSelectionProps {
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: TasksPriority | null,
  ) => void
  onBulkKindChange?: (taskIds: string[], kindId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: TasksStatus) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  selectedIds?: string[]
}

export interface TasksSearchProps {
  onSearchChange?: (search: string) => void
  search?: string
}

export interface TasksPaginationProps {
  onPageChange?: (page: number) => void
  page?: number
  pageCount?: number
  pageSize?: number
  total?: number
}

export interface TasksSavedViewProps {
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: TasksSavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
}

export interface TasksBaseProps<TLabels extends TasksLabels = TasksLabels>
  extends DataCollectionLoadProps,
    DataCollectionFormatProps,
    TasksDataProps,
    TasksViewBuilderProps,
    TasksViewStateProps,
    TasksFilterProps,
    TasksActionProps,
    TasksSelectionProps {
  className?: string
  labels?: TasksLabelsOverride<TLabels>
  now?: string
}
