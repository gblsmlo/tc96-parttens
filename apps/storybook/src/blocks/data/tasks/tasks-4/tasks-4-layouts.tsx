import {
  Tasks4,
  type Tasks4GroupBy,
  type Tasks4Mode,
  type Tasks4PriorityFilter,
  type Tasks4Props,
  type Tasks4Sort,
  type Tasks4SortDirection,
  type Tasks4Status,
  type Tasks4Task,
} from '@tc96/ui/blocks/data/tasks/tasks-4'
import { useEffect, useMemo, useState } from 'react'
import {
  now,
  people,
  projects,
  savedViews,
  tags,
  tasks,
} from '../fixtures/tasks-4.ts'
import type { Tasks4Controls } from './tasks-4-controls.ts'

type Callbacks = Pick<
  Tasks4Props,
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
>

export interface ComposedTasks4Props extends Tasks4Controls, Callbacks {
  error?: boolean
  pending?: boolean
}

const noop = () => undefined
const priorityRank = { high: 2, low: 0, medium: 1, urgent: 3 } as const

const compareBy: Record<Tasks4Sort, (a: Tasks4Task, b: Tasks4Task) => number> =
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
  list: readonly Tasks4Task[],
  sort: Tasks4Sort,
  direction: Tasks4SortDirection,
) =>
  [...list].sort(
    (a, b) => compareBy[sort](a, b) * (direction === 'asc' ? 1 : -1),
  )

const matchesPriority = (
  task: Tasks4Task,
  filter: Tasks4PriorityFilter | null,
) => !filter || (task.priority ?? 'none') === filter

export const ComposedTasks4 = ({
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
  openable,
  pending = false,
  title,
}: Readonly<ComposedTasks4Props>) => {
  const [items, setItems] = useState<Tasks4Task[]>(tasks)
  const [mode, setMode] = useState<Tasks4Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Tasks4GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [sort, setSort] = useState<Tasks4Sort>('due')
  const [sortDirection, setSortDirection] = useState<Tasks4SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<Tasks4Status | null>(null)
  const [priorityFilter, setPriorityFilter] =
    useState<Tasks4PriorityFilter | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (id: string, change: Partial<Tasks4Task>) =>
    setItems((current) =>
      current.map((task) => (task.id === id ? { ...task, ...change } : task)),
    )
  const updateMany = (ids: readonly string[], change: Partial<Tasks4Task>) =>
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
    <Tasks4
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
        (ids: string[], priority: Tasks4Task['priority']) =>
          updateMany(ids, { priority }),
        undefined,
      )}
      onBulkStatusChange={edit(
        (ids: string[], status: Tasks4Status) => updateMany(ids, { status }),
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
        (id: string, priority: Tasks4Task['priority']) =>
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
        (id: string, status: Tasks4Status) => update(id, { status }),
        onStatusChange,
      )}
      onStatusFilterChange={filter(setStatusFilter, onStatusFilterChange)}
      pending={pending}
      people={people}
      priorityFilter={priorityFilter}
      projects={projects}
      savedViewId={savedViewId}
      savedViews={savedViews}
      selectedIds={selectedIds}
      sort={sort}
      sortDirection={sortDirection}
      statusFilter={statusFilter}
      tags={tags}
      tasks={visible}
    />
  )
}
