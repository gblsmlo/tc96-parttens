import {
  Tasks2,
  type Tasks2GroupBy,
  type Tasks2Mode,
  type Tasks2Props,
  type Tasks2Sort,
  type Tasks2SortDirection,
  type Tasks2Status,
  type Tasks2Task,
} from '@tc96/ui/blocks/data/tasks/tasks-2'
import { useEffect, useMemo, useState } from 'react'
import {
  createOptions,
  now,
  people,
  projects,
  tags,
  tasks,
} from '../fixtures/tasks-2.ts'
import type { Tasks2Controls } from './tasks-2-controls.ts'

type Callbacks = Pick<
  Tasks2Props,
  | 'onAssigneeFilterChange'
  | 'onAssigneesChange'
  | 'onBulkDelete'
  | 'onSelectedIdsChange'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onDueChange'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onPriorityChange'
  | 'onProjectChange'
  | 'onProjectFilterChange'
  | 'onSearchChange'
  | 'onSortChange'
  | 'onStatusChange'
  | 'onStatusFilterChange'
>

export interface ComposedTasks2Props extends Tasks2Controls, Callbacks {}

const noop = () => undefined
const priorityRank = { high: 2, low: 0, medium: 1, urgent: 3 } as const

const compareBy: Record<Tasks2Sort, (a: Tasks2Task, b: Tasks2Task) => number> =
  {
    due: (a, b) => (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999'),
    priority: (a, b) =>
      (a.priority ? priorityRank[a.priority] : -1) -
      (b.priority ? priorityRank[b.priority] : -1),
    project: (a, b) => (a.projectId ?? '').localeCompare(b.projectId ?? ''),
    title: (a, b) => a.title.localeCompare(b.title),
    updated: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
  }

const sortTasks = (
  list: readonly Tasks2Task[],
  sort: Tasks2Sort,
  direction: Tasks2SortDirection,
) =>
  [...list].sort(
    (a, b) => compareBy[sort](a, b) * (direction === 'asc' ? 1 : -1),
  )

export const ComposedTasks2 = ({
  create,
  createMenu,
  editable,
  empty,
  groupBy: groupByControl,
  headerActions,
  mode: modeControl,
  onAssigneeFilterChange,
  onAssigneesChange,
  onBulkDelete,
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onGroupByChange,
  onModeChange,
  onOpen,
  onPriorityChange,
  onProjectChange,
  onProjectFilterChange,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  openable,
  title,
}: Readonly<ComposedTasks2Props>) => {
  const [items, setItems] = useState<Tasks2Task[]>(tasks)
  const [mode, setMode] = useState<Tasks2Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Tasks2GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Tasks2Sort>('due')
  const [sortDirection, setSortDirection] = useState<Tasks2SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<Tasks2Status | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (id: string, change: Partial<Tasks2Task>) =>
    setItems((current) =>
      current.map((task) => (task.id === id ? { ...task, ...change } : task)),
    )
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

  const visible = empty
    ? []
    : sortTasks(
        items.filter(
          (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) &&
            (!statusFilter || task.status === statusFilter) &&
            (!projectFilter || task.projectId === projectFilter) &&
            (!assigneeFilter || task.assigneeIds.includes(assigneeFilter)),
        ),
        sort,
        sortDirection,
      )

  return (
    <Tasks2
      assigneeFilter={assigneeFilter}
      createOptions={createMenu ? createOptions : undefined}
      filtered={Boolean(
        search || statusFilter || projectFilter || assigneeFilter,
      )}
      groupBy={groupBy}
      labels={labels}
      mode={mode}
      now={now}
      onAssigneeFilterChange={(next) => {
        setAssigneeFilter(next)
        onAssigneeFilterChange?.(next)
      }}
      onAssigneesChange={edit(
        (id: string, assigneeIds: string[]) => update(id, { assigneeIds }),
        onAssigneesChange,
      )}
      onCollapsedGroupIdsChange={onCollapsedGroupIdsChange}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onDueChange={edit(
        (id: string, dueAt: string | null) =>
          update(id, { dueAt, overdue: false }),
        onDueChange,
      )}
      onGroupByChange={(next) => {
        setGroupBy(next)
        onGroupByChange?.(next)
      }}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onPriorityChange={edit(
        (id: string, priority: Tasks2Task['priority']) =>
          update(id, { priority }),
        onPriorityChange,
      )}
      onProjectChange={edit(
        (id: string, projectId: string | null) => update(id, { projectId }),
        onProjectChange,
      )}
      onProjectFilterChange={(next) => {
        setProjectFilter(next)
        onProjectFilterChange?.(next)
      }}
      onSearchChange={
        headerActions
          ? (next) => {
              setSearch(next)
              onSearchChange?.(next)
            }
          : undefined
      }
      onBulkDelete={edit((ids: string[]) => {
        setItems((current) => current.filter((task) => !ids.includes(task.id)))
        setSelectedIds([])
      }, onBulkDelete)}
      onBulkPriorityChange={edit(
        (ids: string[], priority: Tasks2Task['priority']) =>
          setItems((current) =>
            current.map((task) =>
              ids.includes(task.id) ? { ...task, priority } : task,
            ),
          ),
        undefined,
      )}
      onBulkStatusChange={edit(
        (ids: string[], status: Tasks2Status) =>
          setItems((current) =>
            current.map((task) =>
              ids.includes(task.id) ? { ...task, status } : task,
            ),
          ),
        undefined,
      )}
      onSelectedIdsChange={(next) => {
        setSelectedIds(next)
        onSelectedIdsChange?.(next)
      }}
      onSortChange={(next, direction) => {
        setSort(next)
        setSortDirection(direction)
        onSortChange?.(next, direction)
      }}
      onStatusChange={edit(
        (id: string, status: Tasks2Status) => update(id, { status }),
        onStatusChange,
      )}
      onStatusFilterChange={(next) => {
        setStatusFilter(next)
        onStatusFilterChange?.(next)
      }}
      people={people}
      projectFilter={projectFilter}
      projects={projects}
      search={search}
      selectedIds={selectedIds}
      sort={sort}
      sortDirection={sortDirection}
      statusFilter={statusFilter}
      tags={tags}
      tasks={visible}
    />
  )
}
