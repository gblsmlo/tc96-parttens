import {
  Tasks1,
  type Tasks1GroupBy,
  type Tasks1HideableColumnId,
  type Tasks1Priority,
  type Tasks1Props,
  type Tasks1Sort,
  type Tasks1Status,
  type Tasks1Task,
} from '@tc96/ui/blocks/data/tasks/tasks-1'
import { useEffect, useMemo, useState } from 'react'
import { assignees, projects, tags, tasks } from '../fixtures/tasks-1.ts'
import type { Tasks1Controls } from './tasks-1-controls.ts'

type Callbacks = Pick<
  Tasks1Props,
  | 'onAssigneeFilterChange'
  | 'onAssigneesChange'
  | 'onBulkDelete'
  | 'onBulkPriorityChange'
  | 'onBulkProjectChange'
  | 'onBulkStatusChange'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onDueChange'
  | 'onGroupByChange'
  | 'onHiddenColumnsChange'
  | 'onOpen'
  | 'onPageChange'
  | 'onPriorityChange'
  | 'onPriorityFilterChange'
  | 'onProjectChange'
  | 'onProjectFilterChange'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onStatusChange'
  | 'onStatusFilterChange'
  | 'onTagsChange'
>

export interface ComposedTasks1Props extends Tasks1Controls, Callbacks {}

const noop = () => undefined
const composedPageSize = 6
const priorityRank = { high: 2, low: 0, medium: 1, urgent: 3 } as const

const sortTasks = (list: readonly Tasks1Task[], sort: Tasks1Sort) => {
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
  if (sort === 'title')
    return [...list].sort((a, b) => a.title.localeCompare(b.title))
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export const ComposedTasks1 = ({
  bulkActions,
  create,
  editable,
  empty,
  groupBy: groupByControl,
  headerActions,
  onAssigneeFilterChange,
  onAssigneesChange,
  onBulkDelete,
  onBulkPriorityChange,
  onBulkProjectChange,
  onBulkStatusChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onGroupByChange,
  onHiddenColumnsChange,
  onOpen,
  onPageChange,
  onPriorityChange,
  onPriorityFilterChange,
  onProjectChange,
  onProjectFilterChange,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  onTagsChange,
  openable,
  paginated,
  title,
}: Readonly<ComposedTasks1Props>) => {
  const [items, setItems] = useState<Tasks1Task[]>(tasks)
  const [groupBy, setGroupBy] = useState<Tasks1GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const [hiddenColumns, setHiddenColumns] = useState<Tasks1HideableColumnId[]>(
    [],
  )
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Tasks1Sort>('updated')
  const [statusFilter, setStatusFilter] = useState<Tasks1Status | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Tasks1Priority | null>(
    null,
  )
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (ids: readonly string[], change: Partial<Tasks1Task>) =>
    setItems((current) =>
      current.map((task) =>
        ids.includes(task.id) ? { ...task, ...change } : task,
      ),
    )
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
            (!priorityFilter || task.priority === priorityFilter) &&
            (!projectFilter || task.projectId === projectFilter) &&
            (!assigneeFilter || task.assigneeIds.includes(assigneeFilter)),
        ),
        sort,
      )
  const visible = paginated
    ? matching.slice((page - 1) * composedPageSize, page * composedPageSize)
    : matching

  return (
    <Tasks1
      assigneeFilter={assigneeFilter}
      assignees={assignees}
      collapsedGroupIds={collapsedGroupIds}
      filtered={Boolean(
        search ||
          statusFilter ||
          priorityFilter ||
          projectFilter ||
          assigneeFilter,
      )}
      groupBy={groupBy}
      hiddenColumns={hiddenColumns}
      labels={labels}
      onAssigneeFilterChange={(next) => {
        setAssigneeFilter(next)
        firstPage()
        onAssigneeFilterChange?.(next)
      }}
      onAssigneesChange={edit(
        (id: string, assigneeIds: string[]) => update([id], { assigneeIds }),
        onAssigneesChange,
      )}
      onBulkDelete={bulk(
        (ids: string[]) =>
          setItems((current) =>
            current.filter((task) => !ids.includes(task.id)),
          ),
        onBulkDelete,
      )}
      onBulkPriorityChange={bulk(
        (ids: string[], priority: Tasks1Priority | null) =>
          update(ids, { priority }),
        onBulkPriorityChange,
      )}
      onBulkProjectChange={bulk(
        (ids: string[], projectId: string | null) => update(ids, { projectId }),
        onBulkProjectChange,
      )}
      onBulkStatusChange={bulk(
        (ids: string[], status: Tasks1Status) => update(ids, { status }),
        onBulkStatusChange,
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
      onGroupByChange={(next) => {
        setGroupBy(next)
        setCollapsedGroupIds([])
        onGroupByChange?.(next)
      }}
      onHiddenColumnsChange={(next) => {
        setHiddenColumns(next)
        onHiddenColumnsChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onPageChange={(next) => {
        setPage(next)
        onPageChange?.(next)
      }}
      onPriorityChange={edit(
        (id: string, priority: Tasks1Priority | null) =>
          update([id], { priority }),
        onPriorityChange,
      )}
      onPriorityFilterChange={(next) => {
        setPriorityFilter(next)
        firstPage()
        onPriorityFilterChange?.(next)
      }}
      onProjectChange={edit(
        (id: string, projectId: string | null) => update([id], { projectId }),
        onProjectChange,
      )}
      onProjectFilterChange={(next) => {
        setProjectFilter(next)
        firstPage()
        onProjectFilterChange?.(next)
      }}
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
      onStatusChange={edit(
        (id: string, status: Tasks1Status) => update([id], { status }),
        onStatusChange,
      )}
      onStatusFilterChange={(next) => {
        setStatusFilter(next)
        firstPage()
        onStatusFilterChange?.(next)
      }}
      onTagsChange={edit(
        (id: string, tagIds: string[]) => update([id], { tagIds }),
        onTagsChange,
      )}
      page={paginated ? page : undefined}
      pageCount={
        paginated
          ? Math.max(1, Math.ceil(matching.length / composedPageSize))
          : undefined
      }
      pageSize={paginated ? composedPageSize : undefined}
      priorityFilter={priorityFilter}
      projectFilter={projectFilter}
      projects={projects}
      search={search}
      selectedIds={bulkActions ? selectedIds : undefined}
      sort={sort}
      statusFilter={statusFilter}
      tags={tags}
      tasks={visible}
      total={paginated ? matching.length : undefined}
    />
  )
}
