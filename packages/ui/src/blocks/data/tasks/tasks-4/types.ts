import type { PeoplePropertyLabels } from '@tc96/ui/patterns/properties/core'
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

export type Tasks4Mode = 'kanban' | 'list'

export type Tasks4Status = 'done' | 'in-progress' | 'todo'

export type Tasks4Priority = DataPriority

export type Tasks4PriorityFilter = Tasks4Priority | 'none'

export type Tasks4Sort = 'due' | 'priority' | 'project' | 'title' | 'updated'

export type Tasks4SortDirection = 'asc' | 'desc'

export type Tasks4SortColumn = Extract<Tasks4Sort, Tasks4ColumnId>

export type Tasks4GroupBy = 'priority' | 'project' | 'status'

export type Tasks4KanbanGroupBy = Extract<Tasks4GroupBy, 'priority' | 'status'>

export type Tasks4FilterId = 'assignee' | 'priority' | 'status'

export type Tasks4Person = DataCollectionPerson

export type Tasks4SavedView = DataCollectionSavedView

export interface Tasks4Option {
  id: string
  label: string
}

export interface Tasks4Tag extends Tasks4Option {
  tone: PropertyTone
}

export interface Tasks4Task {
  assigneeIds: string[]
  creatorId: string | null
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Tasks4Priority | null
  projectId: string | null
  status: Tasks4Status
  tagIds: string[]
  title: string
  updatedAt: string
}

export type Tasks4ColumnId =
  | 'assignees'
  | 'creator'
  | 'due'
  | 'priority'
  | 'project'
  | 'status'
  | 'tags'
  | 'title'
  | 'updated'

export interface Tasks4Labels extends DataCollectionLoadLabels {
  activeFilters: (count: number) => string
  clearDate: string
  clearFilters: string
  clearSelection: string
  columns: Record<Tasks4ColumnId, string>
  complete: string
  create: string
  delete: string
  empty: string
  emptyColumn: string
  filter: string
  filterBy: Record<Tasks4FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Tasks4GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  layout: string
  layoutBy: string
  modes: Record<Tasks4Mode, string>
  moreOptions: string
  moreTags: (count: number) => string
  noCreator: string
  noDue: string
  noPriority: string
  noProject: string
  noResult: string
  openTask: (title: string) => string
  peoplePicker: PeoplePropertyLabels
  priorities: Record<Tasks4Priority, string>
  selectedCount: (count: number) => string
  selectionActions: string
  selectAll: string
  selectTask: (title: string) => string
  sort: string
  sortBy: string
  sortColumn: (
    column: Tasks4SortColumn,
    direction: Tasks4SortDirection | null,
  ) => string
  sorts: Record<Tasks4Sort, string>
  status: string
  statuses: Record<Tasks4Status, string>
  title: string
  savedViews: DataCollectionSavedViewLabels
  toolbar: string
  viewList: string
  unassigned: string
}

type Tasks4LabelGroup =
  | 'columns'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'peoplePicker'
  | 'priorities'
  | 'savedViews'
  | 'sorts'
  | 'statuses'

export type Tasks4LabelsOverride = Partial<
  Omit<Tasks4Labels, Tasks4LabelGroup>
> & {
  [TGroup in Tasks4LabelGroup]?: Partial<Tasks4Labels[TGroup]>
}

export interface Tasks4Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  assigneeFilter?: string | null
  className?: string
  collapsedGroupIds?: string[]
  filtered?: boolean
  groupBy?: Tasks4GroupBy | null
  labels?: Tasks4LabelsOverride
  mode?: Tasks4Mode
  now?: string
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks4Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks4Status) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onGroupByChange?: (groupBy: Tasks4GroupBy | null) => void
  onModeChange?: (mode: Tasks4Mode) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (taskId: string, priority: Tasks4Priority | null) => void
  onPriorityFilterChange?: (priority: Tasks4PriorityFilter | null) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Tasks4Sort, direction: Tasks4SortDirection) => void
  onStatusChange?: (taskId: string, status: Tasks4Status) => void
  onStatusFilterChange?: (status: Tasks4Status | null) => void
  people?: Tasks4Person[]
  priorityFilter?: Tasks4PriorityFilter | null
  projects?: Tasks4Option[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Tasks4SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Tasks4Sort
  sortDirection?: Tasks4SortDirection
  statusFilter?: Tasks4Status | null
  tags?: Tasks4Tag[]
  tasks: Tasks4Task[]
}
