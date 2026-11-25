import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Projects3Mode = 'kanban' | 'table'

export type Projects3Status =
  | 'canceled'
  | 'completed'
  | 'in-progress'
  | 'pending'

export type Projects3Priority = DataPriority

export type Projects3Sort = 'due' | 'newest' | 'priority'

export type Projects3GroupBy = 'assignee' | 'priority' | 'status'

export type Projects3KanbanGroupBy = Extract<
  Projects3GroupBy,
  'priority' | 'status'
>

export type Projects3Archived = 'exclude' | 'include' | 'only'

export type Projects3Expanded = true | Record<string, boolean>

export type Projects3Person = DataCollectionPerson

export type Projects3SavedView = DataCollectionSavedView

export interface Projects3Option {
  id: string
  label: string
}

export interface Projects3Task {
  archived?: boolean
  assigneeId: string | null
  description?: string
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Projects3Priority | null
  startAt: string | null
  status: Projects3Status
  subtasks?: Projects3Task[]
  tagIds: string[]
  title: string
  type: string
}

export type Projects3ColumnId =
  | 'assignee'
  | 'due'
  | 'priority'
  | 'start'
  | 'status'
  | 'tags'
  | 'title'
  | 'type'

export interface Projects3Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allAssignees: string
  allStatuses: string
  allTasks: string
  archive: string
  archived: string
  archivedFilter: string
  archivedOptions: Record<Projects3Archived, string>
  clearDate: string
  clearSelection: string
  collapse: (title: string) => string
  columns: Record<Projects3ColumnId, string>
  complete: string
  create: string
  empty: string
  emptyColumn: string
  expand: (title: string) => string
  filters: string
  groupBy: string
  grouping: string
  groupings: Record<Projects3GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  modes: DataCollectionModeLabels
  moreOptions: string
  noDue: string
  noPriority: string
  noResult: string
  noStart: string
  noTags: string
  openTask: (title: string) => string
  pageRange: (first: number, last: number, total: number) => string
  pagination: string
  paginationButtons: CollectionPaginationButtonLabels
  priorities: Record<Projects3Priority, string>
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  search: string
  selectAll: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectTask: (title: string) => string
  sort: string
  sortBy: string
  sorts: Record<Projects3Sort, string>
  statuses: Record<Projects3Status, string>
  unassigned: string
  viewList: string
}

type Projects3LabelGroup =
  | 'archivedOptions'
  | 'columns'
  | 'groupings'
  | 'modes'
  | 'paginationButtons'
  | 'priorities'
  | 'savedViews'
  | 'sorts'
  | 'statuses'

export type Projects3LabelsOverride = Partial<
  Omit<Projects3Labels, Projects3LabelGroup>
> & {
  [TGroup in Projects3LabelGroup]?: Partial<Projects3Labels[TGroup]>
}

export interface Projects3Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  archivedFilter?: Projects3Archived | null
  assigneeFilter?: string | null
  assignees?: Projects3Person[]
  assigneesLoading?: boolean
  className?: string
  collapsedGroupIds?: string[]
  expanded?: Projects3Expanded
  filtered?: boolean
  groupBy?: Projects3GroupBy | null
  labels?: Projects3LabelsOverride
  mode?: Projects3Mode
  onArchivedFilterChange?: (archived: Projects3Archived | null) => void
  onAssigneeChange?: (taskId: string, assigneeId: string) => void
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onBulkArchive?: (taskIds: string[]) => void
  onBulkAssigneeChange?: (taskIds: string[], assigneeId: string | null) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Projects3Priority | null,
  ) => void
  onBulkStatusChange?: (taskIds: string[], status: Projects3Status) => void
  onBulkTypeChange?: (taskIds: string[], type: string) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onExpandedChange?: (expanded: Projects3Expanded) => void
  onGroupByChange?: (groupBy: Projects3GroupBy | null) => void
  onModeChange?: (mode: Projects3Mode) => void
  onOpen?: (taskId: string) => void
  onPageChange?: (page: number) => void
  onPriorityChange?: (
    taskId: string,
    priority: Projects3Priority | null,
  ) => void
  onSavedViewChange?: (savedViewId: string | null) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Projects3Sort) => void
  onStartChange?: (taskId: string, startAt: string) => void
  onStatusChange?: (taskId: string, status: Projects3Status) => void
  onStatusFilterChange?: (status: Projects3Status | null) => void
  onTagFilterChange?: (tagIds: string[]) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  onTypeChange?: (taskId: string, type: string) => void
  page?: number
  pageCount?: number
  pageSize?: number
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Projects3SavedView[]
  savedViewsLoading?: boolean
  search?: string
  selectedIds?: string[]
  sort?: Projects3Sort
  statusFilter?: Projects3Status | null
  tagFilter?: string[]
  tags?: Projects3Option[]
  tagsLoading?: boolean
  tasks: Projects3Task[]
  total?: number
  types?: Projects3Option[]
}
