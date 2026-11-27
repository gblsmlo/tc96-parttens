import type { ArgTypes } from '@storybook/react-vite'
import {
  type TasksBaseProps,
  type TasksColumnId,
  type TasksFilterId,
  type TasksGroupBy,
  type TasksMode,
  type TasksPriority,
  type TasksPriorityFilter,
  type TasksSearchProps,
  type TasksSort,
  type TasksSortDirection,
  type TasksStatus,
  type TasksTask,
  tasksColumnIds,
  tasksFilterIds,
  tasksGroupBys,
  tasksModes,
  tasksSorts,
} from '@tc96/ui/blocks/data/tasks/shared'
import { useEffect, useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

export interface TasksStoryControls {
  editable: boolean
  empty: boolean
  filterIds: TasksFilterId[]
  filters: boolean
  groupBy: TasksGroupBy | 'none'
  groupBys: TasksGroupBy[]
  mode: TasksMode
  modes: TasksMode[]
  openable: boolean
  sorts: TasksSort[]
  visibleColumns: TasksColumnId[]
}

export type TasksStoryCallbacks = Pick<
  TasksBaseProps & TasksSearchProps,
  | 'onAssigneeFilterChange'
  | 'onAssigneesChange'
  | 'onBulkAssigneesChange'
  | 'onBulkDelete'
  | 'onBulkKindChange'
  | 'onBulkPriorityChange'
  | 'onBulkStatusChange'
  | 'onCollapsedGroupIdsChange'
  | 'onDueChange'
  | 'onGroupByChange'
  | 'onKindChange'
  | 'onKindFilterChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onPriorityChange'
  | 'onPriorityFilterChange'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onStatusChange'
  | 'onStatusFilterChange'
  | 'onTagsChange'
  | 'onVisibleColumnsChange'
>

export interface UseTasksStoryOptions
  extends TasksStoryControls,
    TasksStoryCallbacks {
  bulk?: boolean
  initialSort?: TasksSort
  onQueryChange?: () => void
  searchable?: boolean
  tasks: readonly TasksTask[]
}

export const tasksControlArgs = (
  mode: TasksMode,
  modes: readonly TasksMode[],
): TasksStoryControls => ({
  editable: true,
  empty: false,
  filterIds: [...tasksFilterIds],
  filters: true,
  groupBy: 'priority',
  groupBys: [...tasksGroupBys],
  mode,
  modes: [...modes],
  openable: true,
  sorts: [...tasksSorts],
  visibleColumns: [...tasksColumnIds],
})

export const tasksControlArgTypes = (
  modes: readonly TasksMode[],
): Partial<ArgTypes<TasksStoryControls>> => ({
  editable: {
    control: 'boolean',
    description:
      'Passes `onStatusChange`, `onPriorityChange`, `onDueChange`, `onKindChange`, `onAssigneesChange`, `onTagsChange` and the bulk callbacks; off, every field is read-only.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tasks, which renders `labels.empty`.',
  },
  filterIds: {
    control: 'check',
    description:
      'Passes `filters`: a filter submenu shows only when it is listed and its callback is passed.',
    options: [...tasksFilterIds],
  },
  filters: {
    control: 'boolean',
    description:
      'Passes `onStatusFilterChange`, `onPriorityFilterChange`, `onAssigneeFilterChange` and `onKindFilterChange`.',
  },
  groupBy: {
    control: 'inline-radio',
    description: 'The initial `groupBy`; the group submenu changes it too.',
    options: ['none', ...tasksGroupBys],
  },
  groupBys: {
    control: 'check',
    description:
      'Passes `groupBys`: the group options; the Kanban offers only Prioridade and Status of these.',
    options: [...tasksGroupBys],
  },
  mode: {
    control: 'inline-radio',
    description: 'The initial layout; the layout tabs change it too.',
    options: [...modes],
  },
  modes: {
    control: 'check',
    description:
      'Passes `modes`: the layout tabs, in the order Lista, Quadro, Tabela; with fewer than two the tabs do not render.',
    options: [...tasksModes],
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a row or card opens the task.',
  },
  sorts: {
    control: 'check',
    description:
      'Passes `sorts`: the options of the sort submenu, which needs `onSortChange`.',
    options: [...tasksSorts],
  },
  visibleColumns: {
    control: 'check',
    description:
      'Passes `visibleColumns` and `onVisibleColumnsChange`; the title always stays.',
    options: [...tasksColumnIds],
  },
})

const priorityRank = { high: 2, low: 0, medium: 1, urgent: 3 } as const

const compareBy: Record<TasksSort, (a: TasksTask, b: TasksTask) => number> = {
  due: (a, b) => (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999'),
  kind: (a, b) => (a.kindId ?? '').localeCompare(b.kindId ?? ''),
  priority: (a, b) =>
    (a.priority ? priorityRank[a.priority] : -1) -
    (b.priority ? priorityRank[b.priority] : -1),
  title: (a, b) => a.title.localeCompare(b.title),
  updated: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
}

const groupOf = (value: TasksGroupBy | 'none') =>
  value === 'none' ? null : value

export function useTasksStory({
  bulk,
  editable,
  empty,
  filterIds,
  filters,
  groupBy: groupByControl,
  groupBys,
  initialSort = 'due',
  mode: modeControl,
  modes,
  onAssigneeFilterChange,
  onAssigneesChange,
  onBulkAssigneesChange,
  onBulkDelete,
  onBulkKindChange,
  onBulkPriorityChange,
  onBulkStatusChange,
  onCollapsedGroupIdsChange,
  onDueChange,
  onGroupByChange,
  onKindChange,
  onKindFilterChange,
  onModeChange,
  onOpen,
  onPriorityChange,
  onPriorityFilterChange,
  onQueryChange,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  onTagsChange,
  onVisibleColumnsChange,
  openable,
  searchable,
  sorts,
  tasks,
  visibleColumns: visibleColumnsControl,
}: Readonly<UseTasksStoryOptions>) {
  const [items, setItems] = useState<TasksTask[]>([...tasks])
  const [mode, setMode] = useState<TasksMode>(modeControl)
  const [groupBy, setGroupBy] = useState<TasksGroupBy | null>(
    groupOf(groupByControl),
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const [sort, setSort] = useState<TasksSort>(initialSort)
  const [sortDirection, setSortDirection] = useState<TasksSortDirection>(
    initialSort === 'updated' ? 'desc' : 'asc',
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TasksStatus | null>(null)
  const [priorityFilter, setPriorityFilter] =
    useState<TasksPriorityFilter | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [kindFilter, setKindFilter] = useState<string | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<TasksColumnId[]>(
    visibleColumnsControl,
  )

  useEffect(() => setMode(modeControl), [modeControl])
  useEffect(
    () => setVisibleColumns(visibleColumnsControl),
    [visibleColumnsControl],
  )
  useEffect(() => setGroupBy(groupOf(groupByControl)), [groupByControl])

  const update = (ids: readonly string[], change: Partial<TasksTask>) =>
    setItems((current) =>
      current.map((task) =>
        ids.includes(task.id) ? { ...task, ...change } : task,
      ),
    )
  const when =
    (enabled: boolean | undefined) =>
    <TArgs extends unknown[]>(
      apply: (...args: TArgs) => void,
      report: ((...args: TArgs) => void) | undefined,
    ) =>
      enabled
        ? (...args: TArgs) => {
            apply(...args)
            report?.(...args)
          }
        : undefined
  const edit = when(editable)
  const select = when(bulk ?? editable)
  const filter = <TValue>(
    apply: (value: TValue) => void,
    report: ((value: TValue) => void) | undefined,
  ) =>
    when(filters)((value: TValue) => {
      apply(value)
      onQueryChange?.()
    }, report)

  const matching = empty
    ? []
    : items
        .filter(
          (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) &&
            (!statusFilter || task.status === statusFilter) &&
            (!priorityFilter || (task.priority ?? 'none') === priorityFilter) &&
            (!assigneeFilter || task.assigneeIds.includes(assigneeFilter)) &&
            (!kindFilter || task.kindId === kindFilter),
        )
        .sort(
          (a, b) => compareBy[sort](a, b) * (sortDirection === 'asc' ? 1 : -1),
        )

  const props = {
    assigneeFilter,
    filtered: Boolean(
      search || statusFilter || priorityFilter || assigneeFilter || kindFilter,
    ),
    filters: filterIds,
    groupBy,
    groupBys,
    kindFilter,
    mode,
    modes,
    onAssigneeFilterChange: filter(setAssigneeFilter, onAssigneeFilterChange),
    onAssigneesChange: edit(
      (id: string, assigneeIds: string[]) => update([id], { assigneeIds }),
      onAssigneesChange,
    ),
    onBulkAssigneesChange: select(
      (ids: string[], assigneeIds: string[]) => update(ids, { assigneeIds }),
      onBulkAssigneesChange,
    ),
    onBulkDelete: select((ids: string[]) => {
      setItems((current) => current.filter((task) => !ids.includes(task.id)))
      setSelectedIds([])
    }, onBulkDelete),
    onBulkKindChange: select(
      (ids: string[], kindId: string | null) => update(ids, { kindId }),
      onBulkKindChange,
    ),
    onBulkPriorityChange: select(
      (ids: string[], priority: TasksPriority | null) =>
        update(ids, { priority }),
      onBulkPriorityChange,
    ),
    onBulkStatusChange: select(
      (ids: string[], status: TasksStatus) => update(ids, { status }),
      onBulkStatusChange,
    ),
    onCollapsedGroupIdsChange: (next: string[]) => {
      setCollapsedGroupIds(next)
      onCollapsedGroupIdsChange?.(next)
    },
    onDueChange: edit(
      (id: string, dueAt: string | null) =>
        update([id], { dueAt, overdue: false }),
      onDueChange,
    ),
    onGroupByChange: (next: TasksGroupBy | null) => {
      setGroupBy(next)
      setCollapsedGroupIds([])
      onGroupByChange?.(next)
    },
    onKindChange: edit(
      (id: string, kindId: string | null) => update([id], { kindId }),
      onKindChange,
    ),
    onKindFilterChange: filter(setKindFilter, onKindFilterChange),
    onModeChange: (next: TasksMode) => {
      setMode(next)
      onModeChange?.(next)
    },
    onOpen: openable ? (onOpen ?? (() => undefined)) : undefined,
    onPriorityChange: edit(
      (id: string, priority: TasksPriority | null) =>
        update([id], { priority }),
      onPriorityChange,
    ),
    onPriorityFilterChange: filter(setPriorityFilter, onPriorityFilterChange),
    onRetry: () => undefined,
    onSearchChange: searchable
      ? (next: string) => {
          setSearch(next)
          onQueryChange?.()
          onSearchChange?.(next)
        }
      : undefined,
    onSelectedIdsChange: (next: string[]) => {
      setSelectedIds(next)
      onSelectedIdsChange?.(next)
    },
    onSortChange: (next: TasksSort, direction: TasksSortDirection) => {
      setSort(next)
      setSortDirection(direction)
      onQueryChange?.()
      onSortChange?.(next, direction)
    },
    onStatusChange: edit(
      (id: string, status: TasksStatus) => update([id], { status }),
      onStatusChange,
    ),
    onStatusFilterChange: filter(setStatusFilter, onStatusFilterChange),
    onTagsChange: edit(
      (id: string, tagIds: string[]) => update([id], { tagIds }),
      onTagsChange,
    ),
    onVisibleColumnsChange: (next: TasksColumnId[]) => {
      setVisibleColumns(next)
      onVisibleColumnsChange?.(next)
    },
    priorityFilter,
    search,
    selectedIds,
    sort,
    sortDirection,
    sorts,
    statusFilter,
    visibleColumns,
  } satisfies Partial<TasksBaseProps & TasksSearchProps>

  return { collapsedGroupIds, matching, props }
}

export async function expectEveryTasksLayout(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  const showLayout = async (name: string) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Visualização' }),
    )
    await userEvent.click(await screen.findByRole('menuitemradio', { name }))
  }
  await showLayout('Tabela')
  await expect(
    await canvas.findByRole('columnheader', { name: 'Responsáveis' }),
  ).toBeInTheDocument()
  await showLayout('Quadro')
  await waitFor(() =>
    expect(
      canvasElement.querySelector('[data-slot="kanban-column"]'),
    ).not.toBeNull(),
  )
  await expect(canvas.queryByRole('table')).toBeNull()
  await showLayout('Lista')
  await waitFor(() =>
    expect(
      canvasElement.querySelector('[data-slot="list-row-header"]'),
    ).not.toBeNull(),
  )
  await expect(
    canvasElement.querySelector('[data-slot="kanban-column"]'),
  ).toBeNull()
}

type TasksCallbackSpy = ((...args: never[]) => void) | undefined

const priorityTrigger = /^Prioridade: /

const otherPriority = (trigger: HTMLElement) =>
  trigger.getAttribute('aria-label') === 'Prioridade: Baixa'
    ? { label: 'Alta', value: 'high' }
    : { label: 'Baixa', value: 'low' }

async function choosePriority(trigger: HTMLElement, next: { label: string }) {
  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole('option', { name: next.label }))
}

const rowTitle = (row: Element | null) =>
  row?.querySelector('[data-slot="list-row-open-trigger"]')?.textContent ?? ''

export async function expectRowPriorityChange(
  canvasElement: HTMLElement,
  onPriorityChange: TasksCallbackSpy,
) {
  const canvas = within(canvasElement)
  const [trigger] = await canvas.findAllByRole('combobox', {
    name: priorityTrigger,
  })
  const title = rowTitle(trigger.closest('[data-slot="list-row"], article'))
  await expect(title).not.toBe('')
  const next = otherPriority(trigger)
  await choosePriority(trigger, next)
  await waitFor(() => {
    const row = [...canvasElement.querySelectorAll('article')].find(
      (item) => rowTitle(item) === title,
    )
    expect(row).toBeDefined()
    expect(
      within(row as HTMLElement).getByRole('combobox', {
        name: `Prioridade: ${next.label}`,
      }),
    ).toBeVisible()
  })
  await expect(onPriorityChange).toHaveBeenCalledWith(
    expect.any(String),
    next.value,
  )
}

const cardOf = (element: Element) =>
  element.closest<HTMLElement>('[data-pattern="kanban-card"]')

const cardTitle = (card: Element | null) =>
  card?.querySelector('[data-slot="card-title"]')?.textContent ?? ''

export async function expectCardPriorityChange(
  canvasElement: HTMLElement,
  onPriorityChange: TasksCallbackSpy,
) {
  const canvas = within(canvasElement)
  const [trigger] = await canvas.findAllByRole('combobox', {
    name: priorityTrigger,
  })
  const card = cardOf(trigger)
  await expect(card).not.toBeNull()
  const title = cardTitle(card)
  await expect(title).not.toBe('')
  const next = otherPriority(trigger)
  await choosePriority(trigger, next)
  await waitFor(() => {
    const moved = within(canvasElement)
      .getAllByRole('combobox', { name: `Prioridade: ${next.label}` })
      .map(cardOf)
      .find((item) => cardTitle(item) === title)
    expect(moved).toBeDefined()
  })
  await expect(onPriorityChange).toHaveBeenCalledWith(
    expect.any(String),
    next.value,
  )
}

const kanbanColumn = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name: new RegExp(`^${name}`) })

const moveHandle = /^Mover card /

export interface TasksCardMove {
  from: string
  onChange: TasksCallbackSpy
  to: string
  value: string
}

export async function expectCardMove(
  canvasElement: HTMLElement,
  { from, onChange, to, value }: TasksCardMove,
) {
  await within(canvasElement).findAllByRole('button', { name: moveHandle })
  const [handle] = within(kanbanColumn(canvasElement, from)).getAllByRole(
    'button',
    { name: moveHandle },
  )
  const name = handle.getAttribute('aria-label') ?? ''
  handle.focus()
  await userEvent.keyboard('[Space]')
  await waitFor(() =>
    expect(
      document.querySelector('[data-dnd-overlay]'),
    ).not.toBeEmptyDOMElement(),
  )
  await userEvent.keyboard('[ArrowRight]')
  await userEvent.keyboard('[Space]')
  await waitFor(() =>
    expect(
      within(kanbanColumn(canvasElement, to)).getByRole('button', { name }),
    ).toBeInTheDocument(),
  )
  await expect(
    within(kanbanColumn(canvasElement, from)).queryByRole('button', { name }),
  ).toBeNull()
  await expect(onChange).toHaveBeenCalledOnce()
  await expect(onChange).toHaveBeenCalledWith(expect.any(String), value)
}

export async function expectColumnsSectionLabel(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await userEvent.click(
    await canvas.findByRole('button', { name: 'Visualização' }),
  )
  await expect(await screen.findByText('Colunas exibidas')).toBeVisible()
  await expect(screen.queryByText('Propriedades')).not.toBeInTheDocument()
}
