import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  ActionBar,
  type CalendarViewMode,
  type CollectionPreferences,
  CollectionProvider,
  CollectionSearchField,
  CollectionToolbar,
  type CollectionViewMode,
  CollectionViewOutlet,
  DataGridColumnsSubmenu,
  DataGridDensitySubmenu,
  DataGridPagination,
  DataGridSortSubmenu,
  MenuCheckboxOption,
  MenuRadioOption,
  useCollectionPreferences,
  useDataGrid,
  useDataTable,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  ArchiveIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  CircleCheckIcon,
  FlagIcon,
  LayoutGridIcon,
  ListIcon,
  Rows3Icon,
  Table2Icon,
  TableIcon,
  Trash2Icon,
  UsersIcon,
} from 'lucide-react'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  resetPersistedMock,
  usePersistedState,
  useSimulatedFetch,
} from '../fixtures/persisted-mock'
import {
  createDataGridColumns,
  createDataTableColumns,
  taskTableAggregations,
  type UpdateTask,
} from '../fixtures/task-fields'
import {
  createTaskCalendarProps,
  renderTaskKanbanCard,
  renderTaskListRow,
} from '../fixtures/task-renderers'
import {
  createCollection,
  groupings,
  initialTasks,
  people,
  priorityOptions,
  type Task,
  type TaskPriority,
} from '../fixtures/tasks'
import { ViewSwitcherPicker } from '../fixtures/view-switcher-picker'

interface TasksArgs {
  defaultView: CollectionViewMode
  fetchDelay: number
}

const viewModes: readonly ViewSettingsMode<CollectionViewMode>[] = [
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
  { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
  { icon: CalendarDaysIcon, label: 'Calendário', value: 'calendar' },
  { icon: Table2Icon, label: 'Planilha', value: 'datagrid' },
  { icon: TableIcon, label: 'Tabela', value: 'datatable' },
]

const calendarModes: readonly { label: string; value: CalendarViewMode }[] = [
  { label: 'Mês', value: 'month' },
  { label: 'Semana', value: 'week' },
  { label: 'Dia', value: 'day' },
]

const isCalendarMode = (value: string): value is CalendarViewMode =>
  calendarModes.some((mode) => mode.value === value)

type PresetScope = 'all' | 'mine' | 'open'

interface Preset {
  assigneeIds: readonly string[]
  id: string
  label: string
  priorities: readonly TaskPriority[]
  scope: PresetScope
  search: string
  view: CollectionViewMode
}

type PresetSettings = Pick<
  Preset,
  'assigneeIds' | 'priorities' | 'search' | 'view'
>

const basePresets: readonly Pick<Preset, 'id' | 'label' | 'scope'>[] = [
  { id: 'all', label: 'Todas as tarefas', scope: 'all' },
  { id: 'mine', label: 'Minhas tarefas', scope: 'mine' },
  { id: 'open', label: 'Em aberto', scope: 'open' },
]

const createPresets = (view: CollectionViewMode): readonly Preset[] =>
  basePresets.map((preset) => ({
    ...preset,
    assigneeIds: [],
    priorities: [],
    search: '',
    view,
  }))

const hasSameSettings = (a: PresetSettings, b: PresetSettings) =>
  a.view === b.view &&
  a.search === b.search &&
  a.assigneeIds.join() === b.assigneeIds.join() &&
  a.priorities.join() === b.priorities.join()

const CURRENT_USER_ID = 'ana'

const matchesScope = (task: Task, scope: PresetScope) => {
  if (scope === 'mine') return task.assigneeId === CURRENT_USER_ID
  if (scope === 'open') return task.status !== 'done'
  return true
}

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

function TasksWorkspace({
  loading,
  onReset,
  onTasksChange,
  tasks,
}: Readonly<{
  loading: boolean
  onReset: () => void
  onTasksChange: (update: (current: Task[]) => Task[]) => void
  tasks: readonly Task[]
}>): ReactElement {
  const { preferences, setPreferences } = useCollectionPreferences()
  const [presets, setPresets] = usePersistedState('presets', () =>
    createPresets(preferences.view),
  )
  const [presetId, setPresetId] = usePersistedState('preset-id', 'all')
  const [search, setSearch] = usePersistedState('search', '')
  const [assigneeFilter, setAssigneeFilter] = usePersistedState<
    readonly string[]
  >('assignee-filter', [])
  const [priorityFilter, setPriorityFilter] = usePersistedState<
    readonly TaskPriority[]
  >('priority-filter', [])
  const [calendarMode, setCalendarMode] = usePersistedState<CalendarViewMode>(
    'calendar-mode',
    'month',
  )
  const activePreset = presets.find(({ id }) => id === presetId) ?? presets[0]

  const updateTask = useCallback<UpdateTask>(
    (id, change) =>
      onTasksChange((current) =>
        current.map((task) => (task.id === id ? { ...task, ...change } : task)),
      ),
    [onTasksChange],
  )
  const removeTasks = (ids: readonly string[]) =>
    onTasksChange((current) => current.filter((task) => !ids.includes(task.id)))

  const visibleTasks = useMemo(() => {
    const term = search.toLocaleLowerCase('pt-BR')
    return tasks.filter(
      (task) =>
        matchesScope(task, activePreset.scope) &&
        (!term ||
          `${task.id} ${task.title} ${task.description}`
            .toLocaleLowerCase('pt-BR')
            .includes(term)) &&
        (assigneeFilter.length === 0 ||
          assigneeFilter.includes(task.assigneeId)) &&
        (priorityFilter.length === 0 || priorityFilter.includes(task.priority)),
    )
  }, [activePreset.scope, assigneeFilter, priorityFilter, search, tasks])

  const collection = useMemo(
    () => createCollection(visibleTasks),
    [visibleTasks],
  )

  const grouping = groupings.find(({ id }) => id === preferences.groupBy)
  const tableRows = useMemo(() => {
    if (!grouping) return [...visibleTasks]
    const order = grouping.options.map((option) => option.id)
    const position = (task: Task) =>
      order.indexOf(grouping.getGroupId(task) ?? '')
    return [...visibleTasks].sort((a, b) => position(a) - position(b))
  }, [grouping, visibleTasks])

  const dataGridColumns = useMemo(
    () => createDataGridColumns(updateTask),
    [updateTask],
  )
  const { table: dataGridTable } = useDataGrid<Task>({
    columns: dataGridColumns,
    data: tableRows,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (task) => task.id,
    pageSize: 8,
  })

  const dataTableColumns = useMemo(
    () => createDataTableColumns(updateTask),
    [updateTask],
  )
  const { table: dataTable } = useDataTable<Task>({
    columns: dataTableColumns,
    data: tableRows,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (task) => task.id,
    pageSize: 8,
  })

  const groupRowLabel = (task: Task) => {
    if (!grouping) return null
    const groupId = grouping.getGroupId(task)
    return (
      grouping.options.find((option) => option.id === groupId)?.label ?? null
    )
  }

  const replaceTask = (next: Task) => {
    onTasksChange((current) =>
      current.map((task) => (task.id === next.id ? next : task)),
    )
    return true
  }

  const activeFilterCount =
    assigneeFilter.length + priorityFilter.length + (search ? 1 : 0)
  const clearFilters = () => {
    setAssigneeFilter([])
    setPriorityFilter([])
    setSearch('')
  }
  const view = preferences.view
  const usesGrouping =
    view === 'list' || view === 'kanban' || view === 'datagrid'
  const currentSettings: PresetSettings = {
    assigneeIds: assigneeFilter,
    priorities: priorityFilter,
    search,
    view,
  }
  const presetModified = !hasSameSettings(currentSettings, activePreset)

  const selectPreset = (next: Preset) => {
    setPresetId(next.id)
    setAssigneeFilter(next.assigneeIds)
    setPriorityFilter(next.priorities)
    setSearch(next.search)
    setPreferences((current) => ({ ...current, view: next.view }), 'view')
  }
  const savePreset = () =>
    setPresets((current) =>
      current.map((preset) =>
        preset.id === activePreset.id
          ? { ...preset, ...currentSettings }
          : preset,
      ),
    )
  const createPreset = () => {
    const savedCount = presets.filter(({ id }) => id.startsWith('saved-'))
    const next: Preset = {
      ...currentSettings,
      id: `saved-${crypto.randomUUID()}`,
      label: `Nova visão ${savedCount.length + 1}`,
      scope: activePreset.scope,
    }
    setPresets((current) => [...current, next])
    setPresetId(next.id)
  }
  const deletePreset = (id: string) => {
    const remaining = presets.filter((preset) => preset.id !== id)
    setPresets(remaining)
    if (id === activePreset.id) selectPreset(remaining[0])
  }

  const selectionActions = (
    selectedIds: readonly string[],
    clearSelection: () => void,
  ) => [
    {
      items: [
        {
          icon: <CircleCheckIcon />,
          label: 'Concluir',
          onSelect: () => {
            onTasksChange((current) =>
              current.map((task) =>
                selectedIds.includes(task.id)
                  ? { ...task, status: 'done' as const }
                  : task,
              ),
            )
            clearSelection()
          },
          variant: 'primary' as const,
        },
        {
          icon: <ArchiveIcon />,
          label: 'Arquivar',
          onSelect: () => {
            removeTasks(selectedIds)
            clearSelection()
          },
        },
      ],
    },
    {
      items: [
        {
          icon: <Trash2Icon />,
          label: 'Excluir',
          onSelect: () => {
            removeTasks(selectedIds)
            clearSelection()
          },
          variant: 'destructive' as const,
        },
      ],
    },
  ]

  const dataTableSelection = dataTable
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Lançamento do app 2.0</h1>
          <p className="text-muted-foreground text-sm">
            Dados de exemplo salvos neste navegador: edições, filtros e views
            continuam após recarregar.
          </p>
        </div>
        <Button onClick={onReset} size="sm" variant="outline">
          Restaurar dados
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <CollectionToolbar
          aria-label="Controles da coleção de tarefas"
          endSlot={
            <>
              <CollectionSearchField
                label="Buscar tarefas"
                onCommit={setSearch}
                placeholder="Buscar tarefas…"
                value={search}
              />
              <ViewSettingsMenu
                activeFilterCount={activeFilterCount}
                mode={view}
                modes={viewModes}
                onClearFilters={clearFilters}
                onSavePreference={savePreset}
                savePreferenceDisabled={!presetModified}
                onModeChange={(nextView) =>
                  setPreferences(
                    (current) => ({ ...current, view: nextView }),
                    'view',
                  )
                }
              >
                <ViewSettingsSection label="Exibição">
                  {usesGrouping ? (
                    <MenuSub>
                      <MenuSubTrigger>
                        <ListIcon aria-hidden="true" />
                        Agrupar por
                      </MenuSubTrigger>
                      <MenuSubPopup>
                        <MenuRadioGroup
                          onValueChange={(groupBy: string) =>
                            setPreferences(
                              (current) => ({
                                ...current,
                                groupBy: groupBy || null,
                              }),
                              'grouping',
                            )
                          }
                          value={preferences.groupBy ?? ''}
                        >
                          {view === 'kanban' ? null : (
                            <MenuRadioOption value="">
                              Sem agrupamento
                            </MenuRadioOption>
                          )}
                          {groupings.map((dimension) => (
                            <MenuRadioOption
                              key={dimension.id}
                              value={dimension.id}
                            >
                              {dimension.label}
                            </MenuRadioOption>
                          ))}
                        </MenuRadioGroup>
                      </MenuSubPopup>
                    </MenuSub>
                  ) : null}
                  {view === 'calendar' ? (
                    <MenuSub>
                      <MenuSubTrigger>
                        <CalendarRangeIcon aria-hidden="true" />
                        Período
                      </MenuSubTrigger>
                      <MenuSubPopup>
                        <MenuRadioGroup
                          onValueChange={(mode: string) => {
                            if (isCalendarMode(mode)) setCalendarMode(mode)
                          }}
                          value={calendarMode}
                        >
                          {calendarModes.map((mode) => (
                            <MenuRadioOption
                              key={mode.value}
                              value={mode.value}
                            >
                              {mode.label}
                            </MenuRadioOption>
                          ))}
                        </MenuRadioGroup>
                      </MenuSubPopup>
                    </MenuSub>
                  ) : null}
                  {view === 'datagrid' ? (
                    <>
                      <DataGridSortSubmenu table={dataGridTable} />
                      <DataGridDensitySubmenu table={dataGridTable} />
                      <DataGridColumnsSubmenu table={dataGridTable} />
                    </>
                  ) : null}
                  {view === 'datatable' ? (
                    <MenuSub>
                      <MenuSubTrigger>
                        <Table2Icon aria-hidden="true" />
                        Colunas
                      </MenuSubTrigger>
                      <MenuSubPopup>
                        {dataTable
                          .getAllLeafColumns()
                          .filter((column) => column.id !== 'select')
                          .map((column) => (
                            <MenuCheckboxOption
                              checked={column.getIsVisible()}
                              closeOnClick={false}
                              key={column.id}
                              onCheckedChange={(checked) =>
                                column.toggleVisibility(Boolean(checked))
                              }
                            >
                              {typeof column.columnDef.header === 'string'
                                ? column.columnDef.header
                                : 'Estimativa'}
                            </MenuCheckboxOption>
                          ))}
                      </MenuSubPopup>
                    </MenuSub>
                  ) : null}
                </ViewSettingsSection>
                <MenuSeparator />
                <ViewSettingsSection label="Filtros">
                  <MenuSub>
                    <MenuSubTrigger>
                      <UsersIcon aria-hidden="true" />
                      Responsável
                    </MenuSubTrigger>
                    <MenuSubPopup>
                      <MenuGroup>
                        <MenuGroupLabel>Responsável</MenuGroupLabel>
                        {people.map((person) => (
                          <MenuCheckboxOption
                            checked={assigneeFilter.includes(person.id)}
                            closeOnClick={false}
                            key={person.id}
                            onCheckedChange={() =>
                              setAssigneeFilter((current) =>
                                toggle(current, person.id),
                              )
                            }
                          >
                            {person.name}
                          </MenuCheckboxOption>
                        ))}
                      </MenuGroup>
                    </MenuSubPopup>
                  </MenuSub>
                  <MenuSub>
                    <MenuSubTrigger>
                      <FlagIcon aria-hidden="true" />
                      Prioridade
                    </MenuSubTrigger>
                    <MenuSubPopup>
                      <MenuGroup>
                        <MenuGroupLabel>Prioridade</MenuGroupLabel>
                        {priorityOptions.map((option) => (
                          <MenuCheckboxOption
                            checked={priorityFilter.includes(option.value)}
                            closeOnClick={false}
                            key={option.value}
                            onCheckedChange={() =>
                              setPriorityFilter((current) =>
                                toggle(current, option.value),
                              )
                            }
                          >
                            {option.label}
                          </MenuCheckboxOption>
                        ))}
                      </MenuGroup>
                    </MenuSubPopup>
                  </MenuSub>
                </ViewSettingsSection>
              </ViewSettingsMenu>
              <Action label="Nova tarefa" onClick={() => undefined} />
            </>
          }
          startSlot={
            <ViewSwitcherPicker
              onCreate={createPreset}
              onDelete={presets.length > 1 ? deletePreset : undefined}
              onSelect={(id) => {
                const next = presets.find((preset) => preset.id === id)
                if (next) selectPreset(next)
              }}
              selectedId={activePreset.id}
              views={presets}
            />
          }
          variant="plain"
        />

        <section
          aria-label="Visualização da coleção"
          className="flex min-h-0 flex-1 flex-col gap-2"
        >
          <CollectionViewOutlet
            onItemChange={({ item }) => replaceTask(item)}
            calendar={{
              ...createTaskCalendarProps(updateTask),
              loading,
              loadingItemLabel: 'Carregando tarefa',
              mode: calendarMode,
            }}
            collection={collection}
            datagrid={{
              'aria-label': 'Tarefas do lançamento',
              emptyMessage: 'Nenhuma tarefa com esses filtros.',
              getRowGroup: grouping ? groupRowLabel : undefined,
              isLoading: loading,
              selectionActions: ({
                clearSelection,
                selectedCount,
                selectedRows,
              }) => (
                <ActionBar
                  actions={selectionActions(
                    selectedRows.map((task) => task.id),
                    clearSelection,
                  )}
                  onClearSelection={clearSelection}
                  selectedCount={selectedCount}
                  selectedRows={selectedRows}
                />
              ),
              table: dataGridTable,
            }}
            datatable={{
              'aria-label': 'Tarefas do lançamento',
              bordered: true,
              defaultAggregations: taskTableAggregations,
              isLoading: loading,
              emptyMessage: 'Nenhuma tarefa com esses filtros.',
              table: dataTable,
            }}
            kanban={{
              loading,
              loadingCardCount: 2,
              loadingCardLabel: 'Carregando tarefa',
              emptyColumnLabel: 'Nenhuma tarefa nesta coluna.',
              getColumnActions: (column) => ({
                addLabel: `Nova tarefa em ${column.title}`,
                onAddCard: () => undefined,
              }),
            }}
            list={{
              loading,
              loadingItemCount: 3,
              loadingItemLabel: 'Carregando tarefa',
              collapseEmptyGroups: true,
              emptyGroupLabel: 'Nenhuma tarefa neste grupo.',
              renderGroupTitle: (group) => group.label,
            }}
            renderKanbanItem={renderTaskKanbanCard(updateTask)}
            renderListItem={renderTaskListRow(updateTask)}
          />
          {view === 'datatable' ? (
            <>
              <DataGridPagination table={dataTable} />
              {dataTableSelection.length > 0 ? (
                <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center px-3">
                  <div className="pointer-events-auto max-w-full">
                    <ActionBar
                      actions={selectionActions(
                        dataTableSelection.map((task) => task.id),
                        () => dataTable.resetRowSelection(),
                      )}
                      onClearSelection={() => dataTable.resetRowSelection()}
                      selectedCount={dataTableSelection.length}
                      selectedRows={dataTableSelection}
                    />
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
    </main>
  )
}

function TasksCollection({
  defaultView,
  fetchDelay,
  onReset,
}: Readonly<{
  defaultView: CollectionViewMode
  fetchDelay: number
  onReset: () => void
}>): ReactElement {
  const [tasks, setTasks] = usePersistedState<Task[]>('tasks', initialTasks)
  const [preferences, setPreferences] =
    usePersistedState<CollectionPreferences>('preferences', {
      groupBy: 'status',
      view: defaultView,
    })
  const collection = useMemo(() => createCollection(tasks), [tasks])
  const loading = useSimulatedFetch(fetchDelay)

  return (
    <CollectionProvider
      collection={collection}
      onPreferencesChange={setPreferences}
      preferences={preferences}
    >
      <TasksWorkspace
        loading={loading}
        onReset={onReset}
        onTasksChange={setTasks}
        tasks={tasks}
      />
    </CollectionProvider>
  )
}

const meta = {
  args: { defaultView: 'list', fetchDelay: 0 },
  argTypes: {
    defaultView: {
      control: 'inline-radio',
      options: viewModes.map((mode) => mode.value),
    },
    fetchDelay: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'The tasks of an app launch as a navigable use case over one real collection.',
          'The `ViewSettingsMenu` switches between **List**, **Kanban**, **Calendar**, **Spreadsheet** (DataGrid) and **Table** (DataTable), and gathers grouping, calendar range, sorting, density, columns and filters by assignee and priority.',
          'Every edit goes back to the same collection and is saved in `localStorage`: tasks, saved views, filters and layout survive a reload. "Restaurar dados" brings the seed back.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  render: function Tasks({
    defaultView,
    fetchDelay,
  }: Readonly<TasksArgs>): ReactElement {
    const [session, setSession] = useState(0)

    return (
      <TasksCollection
        defaultView={defaultView}
        fetchDelay={fetchDelay}
        key={session}
        onReset={() => {
          resetPersistedMock()
          setSession((current) => current + 1)
        }}
      />
    )
  },
  title: 'Patterns/CollectionViews/Usages/Tasks',
} satisfies Meta<TasksArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { fetchDelay: 200 },
  beforeEach: () => {
    if (import.meta.env.VITEST) resetPersistedMock()
  },
  parameters: {
    docs: {
      description: {
        story:
          'No scripted interaction. Every mount fakes a 200ms server fetch, so the active view shows its skeleton first. Edit, filter and save views, then reload to see the data come back.',
      },
    },
  },
}

export const Persistence: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'A status change in the Table is written to `localStorage`, and a fresh mount reads it back.',
      },
    },
  },
  args: { defaultView: 'datatable' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const row = canvas.getByText('Notificações push').closest('tr')
    if (!row) throw new Error('linha não montou')

    await userEvent.click(
      within(row).getByRole('combobox', { name: 'Status: Backlog' }),
    )
    await userEvent.click(
      await body.findByRole('option', { name: 'Em revisão' }),
    )

    await waitFor(() => {
      const stored = localStorage.getItem('tc96-parttens:mock:v1:tasks')
      expect(stored).toContain('"status":"review"')
    })
  },
}

export const SwitchViews: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Walks the five views through the `ViewSettingsMenu` tabs and checks that each one mounts over the same collection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const views = [
      ['Kanban', 'kanban-view'],
      ['Calendário', 'calendar-view'],
      ['Planilha', 'data-grid'],
      ['Tabela', 'table-container'],
      ['Lista', 'list-view'],
    ] as const

    for (const [label, slot] of views) {
      await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
      await userEvent.click(
        await body.findByRole('menuitemradio', { name: label }),
      )
      await waitFor(() =>
        expect(
          canvasElement.querySelector(`[data-slot="${slot}"]`),
        ).not.toBeNull(),
      )
    }

    await expect(canvas.getByText('Implementar onboarding')).toBeInTheDocument()
  },
}

export const SharedEdits: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Changing the status in the Table rewrites the task in the shared collection.',
      },
    },
  },
  args: { defaultView: 'datatable' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const row = canvas.getByText('Notificações push').closest('tr')
    if (!row) throw new Error('linha não montou')

    await userEvent.click(
      within(row).getByRole('combobox', { name: 'Status: Backlog' }),
    )
    await userEvent.click(
      await body.findByRole('option', { name: 'Em revisão' }),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Kanban' }),
    )
    const review = await canvas.findByRole('region', { name: /Em revisão/ })
    await expect(within(review).getByText('Notificações push')).toBeTruthy()
  },
}

export const Properties: Story = {
  beforeEach: resetPersistedMock,
  args: { defaultView: 'datagrid' },
  parameters: {
    docs: {
      description: {
        story:
          'In the Spreadsheet, every value column is a UI property, including the due date.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const grid = await waitFor(() => {
      const element = canvasElement.querySelector('[data-slot="data-grid"]')
      if (!(element instanceof HTMLElement)) throw new Error('grid não montou')
      return within(element)
    })

    for (const label of [
      /^Status:/,
      /^Prioridade:/,
      /^Responsável:/,
      /^Prazo/,
    ]) {
      await expect(grid.getAllByLabelText(label).length).toBeGreaterThan(0)
    }

    await userEvent.click(
      grid.getAllByLabelText(/^Responsável: Diego Rocha/)[0],
    )
    await userEvent.click(
      await body.findByRole('option', { name: /Carla Mendes/ }),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Tabela' }),
    )
    const row = (await canvas.findByText('Code freeze da versão 2.0')).closest(
      'tr',
    )
    if (!row) throw new Error('linha não montou')
    await expect(within(row).getByText('Carla Mendes')).toBeTruthy()
  },
}

export const KanbanMoveWritesGroup: Story = {
  beforeEach: resetPersistedMock,
  args: { defaultView: 'kanban' },
  parameters: {
    docs: {
      description: {
        story:
          'Each grouping declares `setGroupId`, the write pair of `getGroupId`. A drop into another column makes the outlet build the updated item and hand it to `onItemChange`; the consumer only stores it. The card stays in the new column and the Table shows the new status.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const overlay = () =>
      canvasElement.ownerDocument.querySelector('[data-dnd-overlay]')

    canvas.getByRole('button', { name: 'Mover card Notificações push' }).focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).toBeEmptyDOMElement())

    const todo = canvas.getByRole('region', { name: /A fazer/ })
    await waitFor(() =>
      expect(within(todo).getByText('Notificações push')).toBeTruthy(),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Tabela' }),
    )
    const row = (await canvas.findByText('Notificações push')).closest('tr')
    if (!row) throw new Error('row did not mount')
    await expect(
      within(row).getByRole('combobox', { name: 'Status: A fazer' }),
    ).toBeTruthy()
  },
}

export const SavePreset: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Filters and layout changed in Exibição are saved into the active view with Salvar preferência, or into a new view with Criar nova view.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    const save = await screen.findByRole('menuitem', {
      name: 'Salvar preferência',
    })
    await expect(save).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Kanban' }),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await expect(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('[Escape]')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Criar nova view' }),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Nova visão 1' }),
      ).toBeVisible(),
    )
  },
}

export const DeletePreset: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Excluir removes the active view from the list and falls back to the first one.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Minhas tarefas' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Minhas tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Opções de Minhas tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    )

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as tarefas' }),
    )
    const popover = within(await screen.findByRole('dialog'))
    await waitFor(() =>
      expect(popover.getByRole('button', { name: 'Em aberto' })).toBeVisible(),
    )
    await expect(
      popover.queryByRole('button', { name: 'Minhas tarefas' }),
    ).toBeNull()
  },
}
