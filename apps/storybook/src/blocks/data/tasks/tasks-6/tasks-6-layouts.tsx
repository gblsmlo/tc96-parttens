import {
  Tasks6,
  type Tasks6GroupBy,
  type Tasks6Mode,
  type Tasks6PriorityFilter,
  type Tasks6Props,
  type Tasks6Sort,
  type Tasks6SortDirection,
  type Tasks6Status,
  type Tasks6Task,
} from '@tc96/ui/blocks/data/tasks/tasks-6'
import { useEffect, useMemo, useState } from 'react'
import {
  now,
  people,
  projects,
  savedViews,
  sortOptions,
  statuses,
  tags,
  tasks,
  types,
} from '../fixtures/tasks-6.ts'
import type { Tasks6Controls } from './tasks-6-controls.ts'

type Callbacks = Pick<
  Tasks6Props,
  | 'onAssigneeFilterChange'
  | 'onAssigneesChange'
  | 'onBulkDelete'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onDueChange'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onPriorityChange'
  | 'onPriorityFilterChange'
  | 'onProjectChange'
  | 'onSavedViewSelect'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onStatusChange'
  | 'onStatusFilterChange'
  | 'onTypeChange'
>

export interface ComposedTasks6Props extends Tasks6Controls, Callbacks {
  error?: boolean
  pending?: boolean
}

const noop = () => undefined
const priorityRank = { high: 2, low: 0, medium: 1, urgent: 3 } as const

const compareBy: Record<string, (a: Tasks6Task, b: Tasks6Task) => number> = {
  newest: (a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''),
  due: (a, b) => (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999'),
  priority: (a, b) =>
    (a.priority ? priorityRank[a.priority] : -1) -
    (b.priority ? priorityRank[b.priority] : -1),
  project: (a, b) => (a.projectId ?? '').localeCompare(b.projectId ?? ''),
  title: (a, b) => a.title.localeCompare(b.title),
  updated: (a, b) => (a.updatedAt ?? '').localeCompare(b.updatedAt ?? ''),
}

const sortTasks = (
  list: readonly Tasks6Task[],
  sort: Tasks6Sort,
  direction: Tasks6SortDirection,
) =>
  [...list].sort(
    (a, b) => (compareBy[sort]?.(a, b) ?? 0) * (direction === 'asc' ? 1 : -1),
  )

const matchesPriority = (
  task: Tasks6Task,
  filter: Tasks6PriorityFilter | null,
) => !filter || (task.priority ?? 'none') === filter

export const ComposedTasks6 = ({
  create,
  editable,
  empty,
  error = false,
  filters,
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
  onPriorityFilterChange,
  onProjectChange,
  onSavedViewSelect,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  onTypeChange,
  openable,
  pending = false,
  title,
}: Readonly<ComposedTasks6Props>) => {
  const [items, setItems] = useState<Tasks6Task[]>(tasks)
  const [mode, setMode] = useState<Tasks6Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Tasks6GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [sort, setSort] = useState<Tasks6Sort>('due')
  const [sortDirection, setSortDirection] = useState<Tasks6SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<Tasks6Status | null>(null)
  const [priorityFilter, setPriorityFilter] =
    useState<Tasks6PriorityFilter | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (id: string, change: Partial<Tasks6Task>) =>
    setItems((current) =>
      current.map((task) => (task.id === id ? { ...task, ...change } : task)),
    )
  const updateMany = (ids: readonly string[], change: Partial<Tasks6Task>) =>
    setItems((current) =>
      current.map((task) =>
        ids.includes(task.id) ? { ...task, ...change } : task,
      ),
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
  const filter = <TValue,>(
    apply: (value: TValue) => void,
    report: ((value: TValue) => void) | undefined,
  ) =>
    filters
      ? (value: TValue) => {
          apply(value)
          report?.(value)
        }
      : undefined

  const visible = empty
    ? []
    : sortTasks(
        items.filter(
          (task) =>
            (!statusFilter || task.status === statusFilter) &&
            matchesPriority(task, priorityFilter) &&
            (!assigneeFilter || task.assigneeIds.includes(assigneeFilter)),
        ),
        sort,
        sortDirection,
      )

  return (
    <Tasks6
      assigneeFilter={assigneeFilter}
      error={error}
      filtered={Boolean(statusFilter || priorityFilter || assigneeFilter)}
      groupBy={groupBy}
      labels={labels}
      mode={mode}
      now={now}
      onAssigneeFilterChange={filter(setAssigneeFilter, onAssigneeFilterChange)}
      onAssigneesChange={edit(
        (id: string, assigneeIds: string[]) => update(id, { assigneeIds }),
        onAssigneesChange,
      )}
      onBulkDelete={edit((ids: string[]) => {
        setItems((current) => current.filter((task) => !ids.includes(task.id)))
        setSelectedIds([])
      }, onBulkDelete)}
      onBulkPriorityChange={edit(
        (ids: string[], priority: Tasks6Task['priority']) =>
          updateMany(ids, { priority }),
        undefined,
      )}
      onBulkStatusChange={edit(
        (ids: string[], status: Tasks6Status) => updateMany(ids, { status }),
        undefined,
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
        (id: string, priority: Tasks6Task['priority']) =>
          update(id, { priority }),
        onPriorityChange,
      )}
      onPriorityFilterChange={filter(setPriorityFilter, onPriorityFilterChange)}
      onProjectChange={edit(
        (id: string, projectId: string | null) => update(id, { projectId }),
        onProjectChange,
      )}
      onRetry={noop}
      onSavedViewSelect={(next) => {
        setSavedViewId(next)
        onSavedViewSelect?.(next)
      }}
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
        (id: string, status: Tasks6Status) => update(id, { status }),
        onStatusChange,
      )}
      onStatusFilterChange={filter(setStatusFilter, onStatusFilterChange)}
      onTypeChange={edit(
        (id: string, typeId: string) => update(id, { typeId }),
        onTypeChange,
      )}
      pending={pending}
      people={people}
      priorityFilter={priorityFilter}
      projects={projects}
      savedViewId={savedViewId}
      savedViews={savedViews}
      selectedIds={selectedIds}
      sort={sort}
      sortDirection={sortDirection}
      sortOptions={sortOptions}
      statuses={statuses}
      statusFilter={statusFilter}
      tags={tags}
      tasks={visible}
      types={types}
    />
  )
}
