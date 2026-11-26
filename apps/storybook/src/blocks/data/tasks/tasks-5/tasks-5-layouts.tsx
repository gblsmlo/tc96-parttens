import {
  Tasks5,
  type Tasks5GroupBy,
  type Tasks5Mode,
  type Tasks5PriorityFilter,
  type Tasks5Props,
  type Tasks5Sort,
  type Tasks5SortDirection,
  type Tasks5Status,
  type Tasks5Task,
} from '@tc96/ui/blocks/data/tasks/tasks-5'
import { useEffect, useMemo, useState } from 'react'
import {
  now,
  people,
  projects,
  savedViews,
  tags,
  tasks,
} from '../fixtures/tasks-5.ts'
import type { Tasks5Controls } from './tasks-5-controls.ts'

type Callbacks = Pick<
  Tasks5Props,
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
  | 'onTagsChange'
>

export interface ComposedTasks5Props extends Tasks5Controls, Callbacks {
  error?: boolean
  pending?: boolean
}

const noop = () => undefined
const priorityRank = { high: 2, low: 0, medium: 1, urgent: 3 } as const

const compareBy: Record<Tasks5Sort, (a: Tasks5Task, b: Tasks5Task) => number> =
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
  list: readonly Tasks5Task[],
  sort: Tasks5Sort,
  direction: Tasks5SortDirection,
) =>
  [...list].sort(
    (a, b) => compareBy[sort](a, b) * (direction === 'asc' ? 1 : -1),
  )

const matchesPriority = (
  task: Tasks5Task,
  filter: Tasks5PriorityFilter | null,
) => !filter || (task.priority ?? 'none') === filter

export const ComposedTasks5 = ({
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
  onTagsChange,
  openable,
  pending = false,
  title,
}: Readonly<ComposedTasks5Props>) => {
  const [items, setItems] = useState<Tasks5Task[]>(tasks)
  const [mode, setMode] = useState<Tasks5Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Tasks5GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [sort, setSort] = useState<Tasks5Sort>('due')
  const [sortDirection, setSortDirection] = useState<Tasks5SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<Tasks5Status | null>(null)
  const [priorityFilter, setPriorityFilter] =
    useState<Tasks5PriorityFilter | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (id: string, change: Partial<Tasks5Task>) =>
    setItems((current) =>
      current.map((task) => (task.id === id ? { ...task, ...change } : task)),
    )
  const updateMany = (ids: readonly string[], change: Partial<Tasks5Task>) =>
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
    <Tasks5
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
        (ids: string[], priority: Tasks5Task['priority']) =>
          updateMany(ids, { priority }),
        undefined,
      )}
      onBulkStatusChange={edit(
        (ids: string[], status: Tasks5Status) => updateMany(ids, { status }),
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
        (id: string, priority: Tasks5Task['priority']) =>
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
        (id: string, status: Tasks5Status) => update(id, { status }),
        onStatusChange,
      )}
      onStatusFilterChange={filter(setStatusFilter, onStatusFilterChange)}
      onTagsChange={edit(
        (id: string, tagIds: string[]) => update(id, { tagIds }),
        onTagsChange,
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
      statusFilter={statusFilter}
      tags={tags}
      tasks={visible}
    />
  )
}
