import {
  Projects3,
  type Projects3Archived,
  type Projects3Expanded,
  type Projects3GroupBy,
  type Projects3Mode,
  type Projects3Props,
  type Projects3Sort,
  type Projects3Status,
  type Projects3Task,
} from '@tc96/ui/blocks/data/projects/projects-3'
import { useEffect, useMemo, useState } from 'react'
import {
  assignees,
  savedViews as savedViewList,
  tags,
  tasks,
  types,
} from '../fixtures/projects-3.ts'
import type { Projects3Controls } from './projects-3-controls.ts'

type Callbacks = Pick<
  Projects3Props,
  | 'onArchivedFilterChange'
  | 'onAssigneeChange'
  | 'onAssigneeFilterChange'
  | 'onBulkArchive'
  | 'onBulkAssigneeChange'
  | 'onBulkPriorityChange'
  | 'onBulkStatusChange'
  | 'onBulkTypeChange'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onDueChange'
  | 'onExpandedChange'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onPageChange'
  | 'onPriorityChange'
  | 'onSavedViewChange'
  | 'onSavedViewCreate'
  | 'onSavePreference'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onStartChange'
  | 'onStatusChange'
  | 'onStatusFilterChange'
  | 'onTagFilterChange'
  | 'onTagsChange'
  | 'onTypeChange'
>

export interface ComposedProjects3Props extends Projects3Controls, Callbacks {}

const noop = () => undefined
const composedPageSize = 5
const priorityRank = { high: 2, low: 0, medium: 1, urgent: 3 } as const

const updateTasks = (
  list: readonly Projects3Task[],
  ids: readonly string[],
  change: Partial<Projects3Task>,
): Projects3Task[] =>
  list.map((task) => ({
    ...task,
    ...(ids.includes(task.id) ? change : {}),
    ...(task.subtasks
      ? { subtasks: updateTasks(task.subtasks, ids, change) }
      : {}),
  }))

const sortTasks = (list: readonly Projects3Task[], sort: Projects3Sort) => {
  if (sort === 'due')
    return [...list].sort((a, b) =>
      (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999'),
    )
  if (sort === 'priority')
    return [...list].sort(
      (a, b) =>
        (b.priority ? priorityRank[b.priority] : -1) -
        (a.priority ? priorityRank[a.priority] : -1),
    )
  return [...list]
}

export const ComposedProjects3 = ({
  bulkActions,
  create,
  editable,
  empty,
  groupBy: groupByControl,
  headerActions,
  mode: modeControl,
  onArchivedFilterChange,
  onAssigneeChange,
  onAssigneeFilterChange,
  onBulkArchive,
  onBulkAssigneeChange,
  onBulkPriorityChange,
  onBulkStatusChange,
  onBulkTypeChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onExpandedChange,
  onGroupByChange,
  onModeChange,
  onOpen,
  onPageChange,
  onPriorityChange,
  onSavedViewChange,
  onSavedViewCreate,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStartChange,
  onStatusChange,
  onStatusFilterChange,
  onTagFilterChange,
  onTagsChange,
  onTypeChange,
  openable,
  paginated,
  savedViews,
  title,
}: Readonly<ComposedProjects3Props>) => {
  const [items, setItems] = useState<Projects3Task[]>(tasks)
  const [mode, setMode] = useState<Projects3Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Projects3GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const [expanded, setExpanded] = useState<Projects3Expanded>({})
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Projects3Sort>('newest')
  const [statusFilter, setStatusFilter] = useState<Projects3Status | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [archivedFilter, setArchivedFilter] =
    useState<Projects3Archived | null>(null)
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (ids: readonly string[], change: Partial<Projects3Task>) =>
    setItems((current) => updateTasks(current, ids, change))
  const firstPage = () => setPage(1)
  const edit = <TArgs extends unknown[]>(
    apply: (...args: TArgs) => void,
    report: ((...args: TArgs) => void) | undefined,
  ) =>
    editable
      ? (...args: TArgs) => {
          apply(...args)
          report?.(...args)
        }
      : undefined
  const bulk = <TArgs extends unknown[]>(
    apply: (...args: TArgs) => void,
    report: ((...args: TArgs) => void) | undefined,
  ) =>
    bulkActions
      ? (...args: TArgs) => {
          apply(...args)
          report?.(...args)
        }
      : undefined

  const matching = empty
    ? []
    : sortTasks(
        items.filter(
          (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) &&
            (!statusFilter || task.status === statusFilter) &&
            (!assigneeFilter || task.assigneeId === assigneeFilter) &&
            (tagFilter.length === 0 ||
              task.tagIds.some((id) => tagFilter.includes(id))) &&
            (archivedFilter === 'only'
              ? task.archived
              : archivedFilter === 'include' || !task.archived),
        ),
        sort,
      )
  const visible = paginated
    ? matching.slice((page - 1) * composedPageSize, page * composedPageSize)
    : matching

  return (
    <Projects3
      archivedFilter={archivedFilter}
      assigneeFilter={assigneeFilter}
      assignees={assignees}
      collapsedGroupIds={collapsedGroupIds}
      expanded={expanded}
      filtered={Boolean(
        search ||
          statusFilter ||
          assigneeFilter ||
          tagFilter.length ||
          archivedFilter,
      )}
      groupBy={groupBy}
      labels={labels}
      mode={mode}
      onArchivedFilterChange={(next) => {
        setArchivedFilter(next)
        firstPage()
        onArchivedFilterChange?.(next)
      }}
      onAssigneeChange={edit(
        (id: string, assigneeId: string) => update([id], { assigneeId }),
        onAssigneeChange,
      )}
      onAssigneeFilterChange={(next) => {
        setAssigneeFilter(next)
        firstPage()
        onAssigneeFilterChange?.(next)
      }}
      onBulkArchive={bulk(
        (ids: string[]) => update(ids, { archived: true }),
        onBulkArchive,
      )}
      onBulkAssigneeChange={bulk(
        (ids: string[], assigneeId: string | null) =>
          update(ids, { assigneeId }),
        onBulkAssigneeChange,
      )}
      onBulkPriorityChange={bulk(
        (ids: string[], priority: Projects3Task['priority']) =>
          update(ids, { priority }),
        onBulkPriorityChange,
      )}
      onBulkStatusChange={bulk(
        (ids: string[], status: Projects3Status) => update(ids, { status }),
        onBulkStatusChange,
      )}
      onBulkTypeChange={bulk(
        (ids: string[], type: string) => update(ids, { type }),
        onBulkTypeChange,
      )}
      onCollapsedGroupIdsChange={(next) => {
        setCollapsedGroupIds(next)
        onCollapsedGroupIdsChange?.(next)
      }}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onDueChange={edit(
        (id: string, dueAt: string | null) =>
          update([id], { dueAt, overdue: false }),
        onDueChange,
      )}
      onExpandedChange={(next) => {
        setExpanded(next)
        onExpandedChange?.(next)
      }}
      onGroupByChange={(next) => {
        setGroupBy(next)
        setCollapsedGroupIds([])
        onGroupByChange?.(next)
      }}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onPageChange={(next) => {
        setPage(next)
        onPageChange?.(next)
      }}
      onPriorityChange={edit(
        (id: string, priority: Projects3Task['priority']) =>
          update([id], { priority }),
        onPriorityChange,
      )}
      onSavedViewChange={
        savedViews
          ? (next) => {
              setSavedViewId(next)
              onSavedViewChange?.(next)
            }
          : undefined
      }
      onSavedViewCreate={savedViews ? (onSavedViewCreate ?? noop) : undefined}
      onSavePreference={savedViews ? (onSavePreference ?? noop) : undefined}
      onSearchChange={
        headerActions
          ? (next) => {
              setSearch(next)
              firstPage()
              onSearchChange?.(next)
            }
          : undefined
      }
      onSelectedIdsChange={
        bulkActions
          ? (next) => {
              setSelectedIds(next)
              onSelectedIdsChange?.(next)
            }
          : undefined
      }
      onSortChange={(next) => {
        setSort(next)
        firstPage()
        onSortChange?.(next)
      }}
      onStartChange={edit(
        (id: string, startAt: string) => update([id], { startAt }),
        onStartChange,
      )}
      onStatusChange={edit(
        (id: string, status: Projects3Status) => update([id], { status }),
        onStatusChange,
      )}
      onStatusFilterChange={(next) => {
        setStatusFilter(next)
        firstPage()
        onStatusFilterChange?.(next)
      }}
      onTagFilterChange={(next) => {
        setTagFilter(next)
        firstPage()
        onTagFilterChange?.(next)
      }}
      onTagsChange={edit(
        (id: string, tagIds: string[]) => update([id], { tagIds }),
        onTagsChange,
      )}
      onTypeChange={edit(
        (id: string, type: string) => update([id], { type }),
        onTypeChange,
      )}
      page={paginated ? page : undefined}
      pageCount={
        paginated
          ? Math.max(1, Math.ceil(matching.length / composedPageSize))
          : undefined
      }
      pageSize={paginated ? composedPageSize : undefined}
      savedViewId={savedViews ? savedViewId : undefined}
      savedViews={savedViews ? savedViewList : undefined}
      search={search}
      selectedIds={bulkActions ? selectedIds : undefined}
      sort={sort}
      statusFilter={statusFilter}
      tagFilter={tagFilter}
      tags={tags}
      tasks={visible}
      total={paginated ? matching.length : undefined}
      types={types}
    />
  )
}
