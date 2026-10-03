import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  ActionBar,
  type CalendarViewMode,
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
  PresetsMenu,
  useCollectionPreferences,
  useDataGrid,
  useDataTable,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/parttens'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
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
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  createDataGridColumns,
  createDataTableColumns,
  type UpdateTask,
} from './fixtures/task-fields'
import {
  createTaskCalendarProps,
  moveTaskCard,
  renderTaskKanbanCard,
  renderTaskListRow,
} from './fixtures/task-renderers'
import {
  createCollection,
  groupings,
  initialTasks,
  people,
  priorityOptions,
  type Task,
  type TaskPriority,
} from './fixtures/tasks'

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

const presets = [
  { id: 'all', label: 'Todas as tarefas' },
  { id: 'mine', label: 'Minhas tarefas' },
  { id: 'open', label: 'Em aberto' },
] as const

type PresetId = (typeof presets)[number]['id']

const CURRENT_USER_ID = 'ana'

const matchesPreset = (task: Task, preset: PresetId) => {
  if (preset === 'mine') return task.assigneeId === CURRENT_USER_ID
  if (preset === 'open') return task.status !== 'done'
  return true
}

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

function TasksShowcase({
  onTasksChange,
  tasks,
}: Readonly<{
  onTasksChange: (update: (current: Task[]) => Task[]) => void
  tasks: readonly Task[]
}>): ReactElement {
  const { preferences, setPreferences } = useCollectionPreferences()
  const [preset, setPreset] = useState<PresetId>('all')
  const [search, setSearch] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState<readonly string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<readonly TaskPriority[]>(
    [],
  )
  const [calendarMode, setCalendarMode] = useState<CalendarViewMode>('month')

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
        matchesPreset(task, preset) &&
        (!term ||
          `${task.id} ${task.title} ${task.description}`
            .toLocaleLowerCase('pt-BR')
            .includes(term)) &&
        (assigneeFilter.length === 0 ||
          assigneeFilter.includes(task.assigneeId)) &&
        (priorityFilter.length === 0 || priorityFilter.includes(task.priority)),
    )
  }, [assigneeFilter, preset, priorityFilter, search, tasks])

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

  const moveCard = moveTaskCard(preferences.groupBy, updateTask)

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
  const presetLabel =
    presets.find(({ id }) => id === preset)?.label ?? presets[0].label

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
      <header>
        <h1 className="font-semibold text-2xl">Lançamento do app 2.0</h1>
        <p className="text-muted-foreground text-sm">
          Todas as tarefas do lançamento em uma coleção — troque a view em
          Exibição.
        </p>
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
            <PresetsMenu
              count={visibleTasks.length}
              countLabel={`${visibleTasks.length} tarefas`}
              label={presetLabel}
            >
              <MenuGroup>
                <MenuGroupLabel>Visões salvas</MenuGroupLabel>
                {presets.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={() => setPreset(option.id)}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </MenuGroup>
            </PresetsMenu>
          }
          variant="plain"
        />

        <section
          aria-label="Visualização da coleção"
          className="flex min-h-0 flex-1 flex-col gap-2"
        >
          <CollectionViewOutlet
            calendar={{
              ...createTaskCalendarProps(updateTask),
              mode: calendarMode,
            }}
            collection={collection}
            datagrid={{
              'aria-label': 'Tarefas do lançamento',
              emptyMessage: 'Nenhuma tarefa com esses filtros.',
              getRowGroup: grouping ? groupRowLabel : undefined,
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
              emptyMessage: 'Nenhuma tarefa com esses filtros.',
              table: dataTable,
            }}
            kanban={{
              emptyColumnLabel: 'Nenhuma tarefa nesta coluna.',
              getColumnActions: (column) => ({
                addLabel: `Nova tarefa em ${column.title}`,
                onAddCard: () => undefined,
              }),
              onMoveCard: moveCard,
            }}
            list={{
              collapseEmptyGroups: true,
              emptyGroupLabel: 'Nenhuma tarefa neste grupo.',
              renderGroupTitle: (group) => group.label,
            }}
            renderKanbanItem={renderTaskKanbanCard(
              preferences.groupBy,
              updateTask,
            )}
            renderListItem={renderTaskListRow(updateTask)}
          />
          {view === 'datatable' ? (
            <>
              <DataGridPagination table={dataTable} />
              <ActionBar
                actions={selectionActions(
                  dataTableSelection.map((task) => task.id),
                  () => dataTable.resetRowSelection(),
                )}
                onClearSelection={() => dataTable.resetRowSelection()}
                selectedCount={dataTableSelection.length}
                selectedRows={dataTableSelection}
              />
            </>
          ) : null}
        </section>
      </div>
    </main>
  )
}

function CollectionViewsShowcase({
  defaultView = 'list',
}: Readonly<{ defaultView?: CollectionViewMode }>): ReactElement {
  const [tasks, setTasks] = useState(initialTasks)
  const collection = useMemo(() => createCollection(tasks), [tasks])

  return (
    <CollectionProvider
      collection={collection}
      defaultPreferences={{ groupBy: 'status', view: defaultView }}
    >
      <TasksShowcase onTasksChange={setTasks} tasks={tasks} />
    </CollectionProvider>
  )
}

const meta = {
  argTypes: {
    defaultView: {
      control: 'inline-radio',
      options: viewModes.map((mode) => mode.value),
    },
  },
  component: CollectionViewsShowcase,
  parameters: {
    docs: {
      description: {
        component: [
          'Showcase of the collection views over one real collection: the tasks of an app launch.',
          'The `ViewSettingsMenu` switches between **List**, **Kanban**, **Calendar**, **Spreadsheet** (DataGrid) and **Table** (DataTable), and gathers grouping, calendar range, sorting, density, columns and filters by assignee and priority.',
          'Every edit goes back to the same collection: moving a card in Kanban, rescheduling in the Calendar or changing status and priority in the tables shows up in every view.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews',
} satisfies Meta<typeof CollectionViewsShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
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

export const SpreadsheetProperties: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In the Spreadsheet, every value column is a UI property, including the due date.',
      },
    },
  },
  args: { defaultView: 'datagrid' },
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
