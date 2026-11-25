import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type {
  PeoplePropertyLabels,
  TagsPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Tasks1Status =
  | 'backlog'
  | 'canceled'
  | 'done'
  | 'in-progress'
  | 'todo'

export type Tasks1Priority = DataPriority

export type Tasks1Sort = 'due' | 'priority' | 'title' | 'updated'

export type Tasks1GroupBy = 'priority' | 'status'

export type Tasks1Person = DataCollectionPerson

export interface Tasks1Option {
  id: string
  label: string
}

export interface Tasks1Task {
  assigneeIds: string[]
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Tasks1Priority | null
  projectId: string | null
  status: Tasks1Status
  tagIds: string[]
  title: string
  updatedAt: string
}

export type Tasks1ColumnId =
  | 'assignees'
  | 'due'
  | 'priority'
  | 'project'
  | 'tags'
  | 'task'
  | 'updated'

export type Tasks1HideableColumnId = Exclude<Tasks1ColumnId, 'task'>

export interface Tasks1Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allAssignees: string
  allPriorities: string
  allProjects: string
  allStatuses: string
  changeStatus: (status: string) => string
  clearDate: string
  clearSelection: string
  columns: Record<Tasks1ColumnId, string>
  columnsSection: string
  complete: string
  create: string
  delete: string
  empty: string
  filters: string
  groupBy: string
  grouping: string
  groupings: Record<Tasks1GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  moreOptions: string
  noDue: string
  noPriority: string
  noProject: string
  noResult: string
  openTask: (title: string) => string
  pageRange: (first: number, last: number, total: number) => string
  pagination: string
  paginationButtons: CollectionPaginationButtonLabels
  peoplePicker: PeoplePropertyLabels
  priorities: Record<Tasks1Priority, string>
  savePreference: string
  search: string
  selectAll: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectTask: (title: string) => string
  sort: string
  sortBy: string
  sorts: Record<Tasks1Sort, string>
  status: string
  statuses: Record<Tasks1Status, string>
  tagPicker: TagsPropertyLabels
  unassigned: string
  visibleColumns: string
}

type Tasks1LabelGroup =
  | 'columns'
  | 'groupings'
  | 'paginationButtons'
  | 'peoplePicker'
  | 'priorities'
  | 'sorts'
  | 'statuses'
  | 'tagPicker'

export type Tasks1LabelsOverride = Partial<
  Omit<Tasks1Labels, Tasks1LabelGroup>
> & {
  [TGroup in Tasks1LabelGroup]?: Partial<Tasks1Labels[TGroup]>
}

export interface Tasks1Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  assigneeFilter?: string | null
  assignees?: Tasks1Person[]
  className?: string
  collapsedGroupIds?: string[]
  filtered?: boolean
  groupBy?: Tasks1GroupBy | null
  hiddenColumns?: Tasks1HideableColumnId[]
  labels?: Tasks1LabelsOverride
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks1Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks1Status) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onGroupByChange?: (groupBy: Tasks1GroupBy | null) => void
  onHiddenColumnsChange?: (columnIds: Tasks1HideableColumnId[]) => void
  onOpen?: (taskId: string) => void
  onPageChange?: (page: number) => void
  onPriorityChange?: (taskId: string, priority: Tasks1Priority | null) => void
  onPriorityFilterChange?: (priority: Tasks1Priority | null) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onProjectFilterChange?: (projectId: string | null) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Tasks1Sort) => void
  onStatusChange?: (taskId: string, status: Tasks1Status) => void
  onStatusFilterChange?: (status: Tasks1Status | null) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  page?: number
  pageCount?: number
  pageSize?: number
  priorityFilter?: Tasks1Priority | null
  projectFilter?: string | null
  projects?: Tasks1Option[]
  search?: string
  selectedIds?: string[]
  sort?: Tasks1Sort
  statusFilter?: Tasks1Status | null
  tags?: Tasks1Option[]
  tasks: Tasks1Task[]
  total?: number
}
