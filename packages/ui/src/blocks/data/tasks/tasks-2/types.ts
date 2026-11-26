import type { PeoplePropertyLabels } from '@tc96/ui/patterns/properties/core'
import type { PropertyTone } from '@tc96/ui/property-meta'
import type { ReactNode } from 'react'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionPerson,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'
import type { DataPriority } from '../../shared/properties/data-priority'

export type Tasks2Mode = 'kanban' | 'list'

export type Tasks2Status = 'done' | 'in-progress' | 'todo'

export type Tasks2Priority = DataPriority

export type Tasks2Sort = 'due' | 'priority' | 'project' | 'title' | 'updated'

export type Tasks2SortDirection = 'asc' | 'desc'

export type Tasks2SortColumn = Extract<Tasks2Sort, Tasks2ColumnId>

export type Tasks2GroupBy = 'priority' | 'project' | 'status'

export type Tasks2KanbanGroupBy = Extract<Tasks2GroupBy, 'priority' | 'status'>

export type Tasks2Person = DataCollectionPerson

export interface Tasks2Option {
  id: string
  label: string
}

export interface Tasks2Tag extends Tasks2Option {
  tone: PropertyTone
}

export interface Tasks2CreateOption extends Tasks2Option {
  icon?: ReactNode
}

export interface Tasks2Task {
  assigneeIds: string[]
  creatorId: string | null
  dueAt: string | null
  id: string
  overdue?: boolean
  priority: Tasks2Priority | null
  projectId: string | null
  status: Tasks2Status
  tagIds: string[]
  title: string
  updatedAt: string
}

export type Tasks2ColumnId =
  | 'assignees'
  | 'creator'
  | 'due'
  | 'priority'
  | 'project'
  | 'status'
  | 'tags'
  | 'title'
  | 'updated'

export interface Tasks2Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allAssignees: string
  allProjects: string
  allStatuses: string
  changeStatus: (status: string) => string
  clearDate: string
  clearSelection: string
  complete: string
  columns: Record<Tasks2ColumnId, string>
  create: string
  delete: string
  empty: string
  emptyColumn: string
  filters: string
  groupBy: string
  grouping: string
  groupings: Record<Tasks2GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  modes: DataCollectionModeLabels
  moreOptions: string
  moreTags: (count: number) => string
  noCreator: string
  noDue: string
  noPriority: string
  noProject: string
  noResult: string
  openTask: (title: string) => string
  peoplePicker: PeoplePropertyLabels
  priorities: Record<Tasks2Priority, string>
  search: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectAll: string
  selectTask: (title: string) => string
  sort: string
  sortColumn: (column: string, direction: Tasks2SortDirection | null) => string
  sortBy: string
  sorts: Record<Tasks2Sort, string>
  status: string
  statuses: Record<Tasks2Status, string>
  unassigned: string
}

type Tasks2LabelGroup =
  | 'columns'
  | 'groupings'
  | 'modes'
  | 'peoplePicker'
  | 'priorities'
  | 'sorts'
  | 'statuses'

export type Tasks2LabelsOverride = Partial<
  Omit<Tasks2Labels, Tasks2LabelGroup>
> & {
  [TGroup in Tasks2LabelGroup]?: Partial<Tasks2Labels[TGroup]>
}

export interface Tasks2Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  assigneeFilter?: string | null
  className?: string
  collapsedGroupIds?: string[]
  createOptions?: Tasks2CreateOption[]
  filtered?: boolean
  groupBy?: Tasks2GroupBy | null
  labels?: Tasks2LabelsOverride
  mode?: Tasks2Mode
  now?: string
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks2Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks2Status) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: (optionId?: string) => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onGroupByChange?: (groupBy: Tasks2GroupBy | null) => void
  onModeChange?: (mode: Tasks2Mode) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (taskId: string, priority: Tasks2Priority | null) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onProjectFilterChange?: (projectId: string | null) => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (taskIds: string[]) => void
  onSortChange?: (sort: Tasks2Sort, direction: Tasks2SortDirection) => void
  onStatusChange?: (taskId: string, status: Tasks2Status) => void
  onStatusFilterChange?: (status: Tasks2Status | null) => void
  people?: Tasks2Person[]
  projectFilter?: string | null
  projects?: Tasks2Option[]
  search?: string
  selectedIds?: string[]
  sort?: Tasks2Sort
  sortDirection?: Tasks2SortDirection
  statusFilter?: Tasks2Status | null
  tags?: Tasks2Tag[]
  tasks: Tasks2Task[]
}
