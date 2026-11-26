import {
  ArchiveIcon,
  CalendarDotsIcon,
  CalendarIcon,
  CheckCircleIcon,
  FlagIcon,
  GridFourIcon,
  ListBulletsIcon,
  RowsIcon,
  TableIcon,
  TrashIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  Action,
  ActionBar,
  type CalendarViewMode,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  CollectionFrameOverlay,
  type CollectionLayout,
  CollectionLayoutOutlet,
  type CollectionPreferences,
  CollectionProvider,
  CollectionSearchField,
  CollectionToolbar,
  DataGridColumnsSubmenu,
  DataGridDensitySubmenu,
  DataGridPagination,
  DataGridSortSubmenu,
  useCollectionPreferences,
  useDataGrid,
  useDataTable,
  ViewSettings,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { expect, within } from 'storybook/test'
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
  defaultLayout: CollectionLayout
  fetchDelay: number
}

const layoutModes: readonly ViewSettingsMode<CollectionLayout>[] = [
  { icon: RowsIcon, label: 'Lista', value: 'list' },
  { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
  { icon: CalendarDotsIcon, label: 'Calendário', value: 'calendar' },
  { icon: TableIcon, label: 'Planilha', value: 'datagrid' },
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
  layout: CollectionLayout
}

type PresetSettings = Pick<
  Preset,
  'assigneeIds' | 'priorities' | 'search' | 'layout'
>

const basePresets: readonly Pick<Preset, 'id' | 'label' | 'scope'>[] = [
  { id: 'all', label: 'Todas as tarefas', scope: 'all' },
  { id: 'mine', label: 'Minhas tarefas', scope: 'mine' },
  { id: 'open', label: 'Em aberto', scope: 'open' },
]

const createPresets = (layout: CollectionLayout): readonly Preset[] =>
  basePresets.map((preset) => ({
    ...preset,
    assigneeIds: [],
    priorities: [],
    search: '',
    layout,
  }))

const hasSameSettings = (a: PresetSettings, b: PresetSettings) =>
  a.layout === b.layout &&
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
    createPresets(preferences.layout),
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
  const layout = preferences.layout
  const usesGrouping =
    layout === 'list' || layout === 'kanban' || layout === 'datagrid'
  const currentSettings: PresetSettings = {
    assigneeIds: assigneeFilter,
    priorities: priorityFilter,
    search,
    layout,
  }
  const presetModified = !hasSameSettings(currentSettings, activePreset)

  const selectPreset = (next: Preset) => {
    setPresetId(next.id)
    setAssigneeFilter(next.assigneeIds)
    setPriorityFilter(next.priorities)
    setSearch(next.search)
    setPreferences((current) => ({ ...current, layout: next.layout }), 'layout')
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
          icon: <CheckCircleIcon aria-hidden="true" />,
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
          icon: <ArchiveIcon aria-hidden="true" />,
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
          icon: <TrashIcon aria-hidden="true" />,
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
    <main className="mx-auto flex h-dvh w-full max-w-7xl flex-col gap-4 p-6">
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

      <CollectionFrame>
        <CollectionFrameHeader>
          <CollectionToolbar
            aria-label="Controles da coleção de tarefas"
            right={
              <>
                <CollectionSearchField
                  label="Buscar tarefas"
                  onCommit={setSearch}
                  placeholder="Buscar tarefas…"
                  value={search}
                />
                <ViewSettings
                  activeFilterCount={activeFilterCount}
                  mode={layout}
                  modes={layoutModes}
                  onClearFilters={clearFilters}
                  onSavePreference={savePreset}
                  savePreferenceDisabled={!presetModified}
                  onModeChange={(nextView) =>
                    setPreferences(
                      (current) => ({ ...current, layout: nextView }),
                      'layout',
                    )
                  }
                >
                  <ViewSettingsSection label="Exibição">
                    {usesGrouping ? (
                      <MenuSub>
                        <MenuSubTrigger>
                          <ListBulletsIcon aria-hidden="true" />
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
                            {layout === 'kanban' ? null : (
                              <MenuRadioItem value="">
                                Sem agrupamento
                              </MenuRadioItem>
                            )}
                            {groupings.map((dimension) => (
                              <MenuRadioItem
                                key={dimension.id}
                                value={dimension.id}
                              >
                                {dimension.label}
                              </MenuRadioItem>
                            ))}
                          </MenuRadioGroup>
                        </MenuSubPopup>
                      </MenuSub>
                    ) : null}
                    {layout === 'calendar' ? (
                      <MenuSub>
                        <MenuSubTrigger>
                          <CalendarIcon aria-hidden="true" />
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
                              <MenuRadioItem
                                key={mode.value}
                                value={mode.value}
                              >
                                {mode.label}
                              </MenuRadioItem>
                            ))}
                          </MenuRadioGroup>
                        </MenuSubPopup>
                      </MenuSub>
                    ) : null}
                    {layout === 'datagrid' ? (
                      <>
                        <DataGridSortSubmenu table={dataGridTable} />
                        <DataGridDensitySubmenu table={dataGridTable} />
                        <DataGridColumnsSubmenu table={dataGridTable} />
                      </>
                    ) : null}
                    {layout === 'datatable' ? (
                      <MenuSub>
                        <MenuSubTrigger>
                          <TableIcon aria-hidden="true" />
                          Colunas
                        </MenuSubTrigger>
                        <MenuSubPopup>
                          {dataTable
                            .getAllLeafColumns()
                            .filter((column) => column.id !== 'select')
                            .map((column) => (
                              <MenuCheckboxItem
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
                              </MenuCheckboxItem>
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
                            <MenuCheckboxItem
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
                            </MenuCheckboxItem>
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
                            <MenuCheckboxItem
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
                            </MenuCheckboxItem>
                          ))}
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuSub>
                  </ViewSettingsSection>
                </ViewSettings>
                <Action label="Nova tarefa" onClick={() => undefined} />
              </>
            }
            left={
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
            mode="plain"
          />
        </CollectionFrameHeader>

        <CollectionFrameBody aria-label="Visualização da coleção">
          <CollectionLayoutOutlet
            onRecordChange={({ record }) => replaceTask(record)}
            calendar={{
              ...createTaskCalendarProps(updateTask),
              loading,
              loadingLabel: 'Carregando tarefa',
              mode: calendarMode,
            }}
            collection={collection}
            datagrid={{
              'aria-label': 'Tarefas do lançamento',
              emptyMessage: 'Nenhuma tarefa com esses filtros.',
              getRowGroup: grouping ? groupRowLabel : undefined,
              loading: loading,
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
              loading: loading,
              emptyMessage: 'Nenhuma tarefa com esses filtros.',
              table: dataTable,
            }}
            kanban={{
              loading,
              loadingCount: 2,
              loadingLabel: 'Carregando tarefa',
              emptyGroupLabel: 'Nenhuma tarefa nesta coluna.',
              getGroupActions: (column) => ({
                addLabel: `Nova tarefa em ${column.title}`,
                onRecordAdd: () => undefined,
              }),
            }}
            list={{
              loading,
              loadingCount: 3,
              loadingLabel: 'Carregando tarefa',
              collapseEmptyGroups: true,
              emptyGroupLabel: 'Nenhuma tarefa neste grupo.',
              renderGroupTitle: (group) => group.label,
            }}
            renderKanbanRecord={renderTaskKanbanCard(updateTask)}
            renderListRecord={renderTaskListRow(updateTask)}
          />
        </CollectionFrameBody>
        {layout === 'datatable' ? (
          <CollectionFrameFooter>
            <DataGridPagination table={dataTable} />
            {dataTableSelection.length > 0 ? (
              <CollectionFrameOverlay>
                <ActionBar
                  actions={selectionActions(
                    dataTableSelection.map((task) => task.id),
                    () => dataTable.resetRowSelection(),
                  )}
                  onClearSelection={() => dataTable.resetRowSelection()}
                  selectedCount={dataTableSelection.length}
                  selectedRows={dataTableSelection}
                />
              </CollectionFrameOverlay>
            ) : null}
          </CollectionFrameFooter>
        ) : null}
      </CollectionFrame>
    </main>
  )
}

function TasksCollection({
  defaultLayout,
  fetchDelay,
  onReset,
}: Readonly<{
  defaultLayout: CollectionLayout
  fetchDelay: number
  onReset: () => void
}>): ReactElement {
  const [tasks, setTasks] = usePersistedState<Task[]>('tasks', initialTasks)
  const [preferences, setPreferences] =
    usePersistedState<CollectionPreferences>('preferences', {
      groupBy: 'status',
      layout: defaultLayout,
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
  args: { defaultLayout: 'list', fetchDelay: 0 },
  argTypes: {
    defaultLayout: {
      control: 'inline-radio',
      options: layoutModes.map((mode) => mode.value),
    },
    fetchDelay: { control: 'number' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: function Tasks({
    defaultLayout,
    fetchDelay,
  }: Readonly<TasksArgs>): ReactElement {
    const [session, setSession] = useState(0)

    return (
      <TasksCollection
        defaultLayout={defaultLayout}
        fetchDelay={fetchDelay}
        key={session}
        onReset={() => {
          resetPersistedMock()
          setSession((current) => current + 1)
        }}
      />
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Usages',
} satisfies Meta<TasksArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Tasks: Story = {
  args: { fetchDelay: 200 },
  beforeEach: () => {
    if (import.meta.env.VITEST) resetPersistedMock()
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Implementar onboarding',
        {},
        { timeout: 3000 },
      ),
    ).toBeVisible()
  },
}
