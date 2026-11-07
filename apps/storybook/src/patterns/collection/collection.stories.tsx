import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  type CalendarViewMode,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  type CollectionLayout,
  CollectionLayoutOutlet,
  CollectionPagination,
  type CollectionPreferences,
  CollectionProvider,
  CollectionToolbar,
  DataGridColumnsSubmenu,
  DataGridDensitySubmenu,
  DataGridPagination,
  MenuCheckboxOption,
  MenuRadioOption,
  useDataGrid,
  useDataTable,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/parttens'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { Separator } from '@tc96/ui/separator'
import {
  ArrowDownUpIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  CircleDotIcon,
  Clock3Icon,
  FlagIcon,
  GalleryVerticalEndIcon,
  LayoutGridIcon,
  ListIcon,
  Rows3Icon,
  Table2Icon,
  TableIcon,
  UsersIcon,
} from 'lucide-react'
import {
  type ComponentType,
  type ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import { collectionTasks } from './fixtures/collection-tasks'
import {
  createDataGridColumns,
  createDataTableColumns,
  taskTableAggregations,
  type UpdateTask,
} from './fixtures/task-fields'
import {
  countTaskQuery,
  emptyTaskQuery,
  isTaskDueFilter,
  isTaskSortField,
  matchesTaskQuery,
  sameTaskQuery,
  sortTasks,
  type TaskQuery,
  taskDueFilters,
  taskEstimateRanges,
  taskSortFields,
} from './fixtures/task-query'
import {
  createTaskCalendarProps,
  renderTaskGalleryCard,
  renderTaskKanbanCard,
  renderTaskListRow,
} from './fixtures/task-renderers'
import {
  createCollection,
  groupings,
  people,
  priorityOptions,
  statusOptions,
  type Task,
} from './fixtures/tasks'

const PAGE_SIZE = 16

const layoutModes: readonly ViewSettingsMode<CollectionLayout>[] = [
  { icon: TableIcon, label: 'Tabela', value: 'datatable' },
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
  { icon: Table2Icon, label: 'Planilha', value: 'datagrid' },
  { icon: GalleryVerticalEndIcon, label: 'Galeria', value: 'gallery' },
  { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
  { icon: CalendarDaysIcon, label: 'Calendário', value: 'calendar' },
]

const calendarModes: readonly { label: string; value: CalendarViewMode }[] = [
  { label: 'Mês', value: 'month' },
  { label: 'Semana', value: 'week' },
  { label: 'Dia', value: 'day' },
]

const isCalendarMode = (value: string): value is CalendarViewMode =>
  calendarModes.some((mode) => mode.value === value)

type ViewScope = 'all' | 'mine' | 'open'

interface ViewSettings {
  groupBy: string | null
  layout: CollectionLayout
  query: TaskQuery
}

interface SavedView extends ViewSettings {
  id: string
  label: string
  scope: ViewScope
}

const createSavedViews = (layout: CollectionLayout): readonly SavedView[] =>
  [
    { id: 'all', label: 'Todas as tarefas', scope: 'all' as const },
    { id: 'mine', label: 'Minhas tarefas', scope: 'mine' as const },
    { id: 'open', label: 'Em aberto', scope: 'open' as const },
  ].map((view) => ({
    ...view,
    groupBy: 'status',
    layout,
    query: emptyTaskQuery,
  }))

const sameSettings = (a: ViewSettings, b: ViewSettings) =>
  a.layout === b.layout &&
  a.groupBy === b.groupBy &&
  sameTaskQuery(a.query, b.query)

const CURRENT_USER_ID = 'ana'

const matchesScope = (task: Task, scope: ViewScope) => {
  if (scope === 'mine') return task.assigneeId === CURRENT_USER_ID
  if (scope === 'open') return task.status !== 'done'
  return true
}

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

const viewIcon = (
  <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
    <LayoutGridIcon aria-hidden="true" className="size-3" />
  </span>
)

function CheckboxFilterSubmenu<TValue extends string>({
  icon: Icon,
  label,
  onToggle,
  options,
  selected,
}: Readonly<{
  icon: ComponentType<{ 'aria-hidden'?: boolean | 'true' }>
  label: string
  onToggle: (value: TValue) => void
  options: readonly { label: string; value: TValue }[]
  selected: readonly TValue[]
}>): ReactElement {
  return (
    <MenuSub>
      <MenuSubTrigger>
        <Icon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        <MenuGroup>
          <MenuGroupLabel>{label}</MenuGroupLabel>
          {options.map((option) => (
            <MenuCheckboxOption
              checked={selected.includes(option.value)}
              closeOnClick={false}
              key={option.value}
              onCheckedChange={() => onToggle(option.value)}
            >
              {option.label}
            </MenuCheckboxOption>
          ))}
        </MenuGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}

function CollectionWorkspace({
  defaultLayout,
}: Readonly<{ defaultLayout: CollectionLayout }>): ReactElement {
  const [tasks, setTasks] = useState<Task[]>([...collectionTasks])
  const [preferences, setPreferences] = useState<CollectionPreferences>({
    groupBy: 'status',
    layout: defaultLayout,
  })
  const [views, setViews] = useState(() => createSavedViews(defaultLayout))
  const [viewId, setViewId] = useState('all')
  const [viewQuery, setViewQuery] = useState('')
  const [query, setQuery] = useState<TaskQuery>(emptyTaskQuery)
  const [calendarMode, setCalendarMode] = useState<CalendarViewMode>('month')
  const [page, setPage] = useState(1)

  const activeView = views.find(({ id }) => id === viewId) ?? views[0]
  const layout = preferences.layout
  const usesGrouping =
    layout === 'list' || layout === 'kanban' || layout === 'datagrid'

  const updateTask = useCallback<UpdateTask>(
    (id, change) =>
      setTasks((current) =>
        current.map((task) => (task.id === id ? { ...task, ...change } : task)),
      ),
    [],
  )
  const updateQuery = (change: Partial<TaskQuery>) => {
    setQuery((current) => ({ ...current, ...change }))
    setPage(1)
  }

  const visibleTasks = useMemo(
    () =>
      sortTasks(
        tasks.filter(
          (task) =>
            matchesScope(task, activeView.scope) &&
            matchesTaskQuery(task, query),
        ),
        query.sort,
      ),
    [activeView.scope, query, tasks],
  )

  const grouping = usesGrouping
    ? groupings.find(({ id }) => id === preferences.groupBy)
    : undefined
  const orderedTasks = useMemo(() => {
    if (!grouping) return visibleTasks
    const order = grouping.options.map((option) => option.id)
    const position = (task: Task) =>
      order.indexOf(grouping.getGroupId(task) ?? '')
    return [...visibleTasks].sort((a, b) => position(a) - position(b))
  }, [grouping, visibleTasks])

  const pageCount = Math.max(1, Math.ceil(orderedTasks.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paginated = layout === 'list' || layout === 'gallery'
  const collection = useMemo(
    () =>
      createCollection(
        paginated
          ? orderedTasks.slice(
              (currentPage - 1) * PAGE_SIZE,
              currentPage * PAGE_SIZE,
            )
          : orderedTasks,
      ),
    [currentPage, orderedTasks, paginated],
  )

  const dataGridColumns = useMemo(
    () => createDataGridColumns(updateTask),
    [updateTask],
  )
  const { table: dataGridTable } = useDataGrid<Task>({
    columns: dataGridColumns,
    data: orderedTasks,
    enablePagination: true,
    enableRowSelection: true,
    enableSorting: false,
    getRowId: (task) => task.id,
    pageSize: PAGE_SIZE,
  })

  const dataTableColumns = useMemo(
    () => createDataTableColumns(updateTask),
    [updateTask],
  )
  const { table: dataTable } = useDataTable<Task>({
    columns: dataTableColumns,
    data: orderedTasks,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (task) => task.id,
    pageSize: PAGE_SIZE,
  })

  const groupRowLabel = (task: Task) => {
    if (!grouping) return null
    const groupId = grouping.getGroupId(task)
    return (
      grouping.options.find((option) => option.id === groupId)?.label ?? null
    )
  }

  const clearFilters = () => {
    setQuery(emptyTaskQuery)
    setPage(1)
  }

  const currentSettings: ViewSettings = {
    groupBy: preferences.groupBy,
    layout,
    query,
  }
  const viewModified = !sameSettings(currentSettings, activeView)

  const selectView = (view: SavedView) => {
    setViewId(view.id)
    setQuery(view.query)
    setPreferences({ groupBy: view.groupBy, layout: view.layout })
    setPage(1)
  }
  const saveView = () =>
    setViews((current) =>
      current.map((view) =>
        view.id === activeView.id ? { ...view, ...currentSettings } : view,
      ),
    )

  const filteredViews = views.filter((view) =>
    view.label
      .toLocaleLowerCase('pt-BR')
      .includes(viewQuery.toLocaleLowerCase('pt-BR')),
  )
  const createView = () => {
    const id = `saved-${views.length + 1}`
    setViews((current) => [
      ...current,
      {
        ...currentSettings,
        id,
        label: `Nova view ${current.length - 2}`,
        scope: activeView.scope,
      },
    ])
    setViewId(id)
  }

  return (
    <main className="mx-auto flex h-dvh w-full max-w-7xl flex-col gap-4 p-6">
      <CollectionProvider
        collection={collection}
        onPreferencesChange={(next) => {
          setPreferences(next)
          setPage(1)
        }}
        preferences={preferences}
      >
        <CollectionFrame>
          <CollectionFrameHeader>
            <CollectionToolbar
              aria-label="Controles da coleção de tarefas"
              endSlot={
                <>
                  <ViewSettingsMenu
                    activeFilterCount={countTaskQuery(query)}
                    mode={layout}
                    modes={layoutModes}
                    onClearFilters={clearFilters}
                    onSavePreference={saveView}
                    savePreferenceDisabled={!viewModified}
                    onModeChange={(next) => {
                      setPreferences((current) => ({
                        ...current,
                        layout: next,
                      }))
                      setPage(1)
                    }}
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
                                setPreferences((current) => ({
                                  ...current,
                                  groupBy: groupBy || null,
                                }))
                              }
                              value={preferences.groupBy ?? ''}
                            >
                              {layout === 'kanban' ? null : (
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
                      {layout === 'calendar' ? (
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
                      ) : (
                        <MenuSub>
                          <MenuSubTrigger>
                            <ArrowDownUpIcon aria-hidden="true" />
                            Ordenar por
                          </MenuSubTrigger>
                          <MenuSubPopup>
                            <MenuGroup>
                              <MenuGroupLabel>Propriedade</MenuGroupLabel>
                              <MenuRadioGroup
                                onValueChange={(field: string) =>
                                  updateQuery({
                                    sort: isTaskSortField(field)
                                      ? {
                                          desc: query.sort?.desc ?? false,
                                          field,
                                        }
                                      : null,
                                  })
                                }
                                value={query.sort?.field ?? ''}
                              >
                                <MenuRadioOption value="">
                                  Sem ordenação
                                </MenuRadioOption>
                                {taskSortFields.map((field) => (
                                  <MenuRadioOption
                                    key={field.value}
                                    value={field.value}
                                  >
                                    {field.label}
                                  </MenuRadioOption>
                                ))}
                              </MenuRadioGroup>
                            </MenuGroup>
                            <MenuSeparator />
                            <MenuGroup>
                              <MenuGroupLabel>Direção</MenuGroupLabel>
                              <MenuRadioGroup
                                onValueChange={(direction: string) => {
                                  if (query.sort)
                                    updateQuery({
                                      sort: {
                                        ...query.sort,
                                        desc: direction === 'desc',
                                      },
                                    })
                                }}
                                value={query.sort?.desc ? 'desc' : 'asc'}
                              >
                                <MenuRadioOption
                                  disabled={!query.sort}
                                  value="asc"
                                >
                                  Crescente
                                </MenuRadioOption>
                                <MenuRadioOption
                                  disabled={!query.sort}
                                  value="desc"
                                >
                                  Decrescente
                                </MenuRadioOption>
                              </MenuRadioGroup>
                            </MenuGroup>
                          </MenuSubPopup>
                        </MenuSub>
                      )}
                      {layout === 'datagrid' ? (
                        <>
                          <DataGridDensitySubmenu table={dataGridTable} />
                          <DataGridColumnsSubmenu table={dataGridTable} />
                        </>
                      ) : null}
                    </ViewSettingsSection>
                    <MenuSeparator />
                    <ViewSettingsSection label="Filtros">
                      <CheckboxFilterSubmenu
                        icon={CircleDotIcon}
                        label="Status"
                        onToggle={(status) =>
                          updateQuery({
                            statuses: toggle(query.statuses, status),
                          })
                        }
                        options={statusOptions}
                        selected={query.statuses}
                      />
                      <CheckboxFilterSubmenu
                        icon={FlagIcon}
                        label="Prioridade"
                        onToggle={(priority) =>
                          updateQuery({
                            priorities: toggle(query.priorities, priority),
                          })
                        }
                        options={priorityOptions}
                        selected={query.priorities}
                      />
                      <CheckboxFilterSubmenu
                        icon={UsersIcon}
                        label="Responsável"
                        onToggle={(assigneeId) =>
                          updateQuery({
                            assigneeIds: toggle(query.assigneeIds, assigneeId),
                          })
                        }
                        options={people.map((person) => ({
                          label: person.name,
                          value: person.id,
                        }))}
                        selected={query.assigneeIds}
                      />
                      <MenuSub>
                        <MenuSubTrigger>
                          <CalendarClockIcon aria-hidden="true" />
                          Prazo
                        </MenuSubTrigger>
                        <MenuSubPopup>
                          <MenuGroup>
                            <MenuGroupLabel>Prazo</MenuGroupLabel>
                            <MenuRadioGroup
                              onValueChange={(due: string) =>
                                updateQuery({
                                  due: isTaskDueFilter(due) ? due : null,
                                })
                              }
                              value={query.due ?? ''}
                            >
                              <MenuRadioOption value="">
                                Qualquer prazo
                              </MenuRadioOption>
                              {taskDueFilters.map((filter) => (
                                <MenuRadioOption
                                  key={filter.value}
                                  value={filter.value}
                                >
                                  {filter.label}
                                </MenuRadioOption>
                              ))}
                            </MenuRadioGroup>
                          </MenuGroup>
                        </MenuSubPopup>
                      </MenuSub>
                      <CheckboxFilterSubmenu
                        icon={Clock3Icon}
                        label="Estimativa"
                        onToggle={(range) =>
                          updateQuery({
                            estimates: toggle(query.estimates, range),
                          })
                        }
                        options={taskEstimateRanges}
                        selected={query.estimates}
                      />
                    </ViewSettingsSection>
                  </ViewSettingsMenu>
                  <Action label="Nova tarefa" onClick={() => undefined} />
                </>
              }
              startSlot={
                <ViewSwitcherMenu icon={viewIcon} label={activeView.label}>
                  <ViewSwitcherSearch
                    onValueChange={setViewQuery}
                    value={viewQuery}
                  />
                  {filteredViews.length ? (
                    <ViewSwitcherItems>
                      {filteredViews.map((view) => (
                        <ViewSwitcherItem
                          icon={viewIcon}
                          key={view.id}
                          label={view.label}
                          onSelect={() => selectView(view)}
                          selected={view.id === activeView.id}
                        />
                      ))}
                    </ViewSwitcherItems>
                  ) : (
                    <p className="px-2 py-1.5 text-muted-foreground text-sm">
                      Nenhuma view encontrada
                    </p>
                  )}
                  <Separator />
                  <ViewSwitcherCreate onClick={createView} />
                </ViewSwitcherMenu>
              }
              variant="plain"
            />
          </CollectionFrameHeader>

          <CollectionFrameBody aria-label="Visualização da coleção">
            <CollectionLayoutOutlet
              calendar={{
                ...createTaskCalendarProps(updateTask),
                mode: calendarMode,
              }}
              collection={collection}
              datagrid={{
                'aria-label': 'Tarefas do lançamento',
                emptyMessage: 'Nenhuma tarefa com esses filtros.',
                getRowGroup: grouping ? groupRowLabel : undefined,
                table: dataGridTable,
              }}
              datatable={{
                'aria-label': 'Tarefas do lançamento',
                bordered: true,
                defaultAggregations: taskTableAggregations,
                emptyMessage: 'Nenhuma tarefa com esses filtros.',
                table: dataTable,
              }}
              gallery={{ emptyMessage: 'Nenhuma tarefa com esses filtros.' }}
              kanban={{
                emptyColumnLabel: 'Nenhuma tarefa nesta coluna.',
                getColumnActions: (column) => ({
                  addLabel: `Nova tarefa em ${column.title}`,
                  onAddCard: () => undefined,
                }),
              }}
              list={{
                collapseEmptyGroups: true,
                emptyGroupLabel: 'Nenhuma tarefa neste grupo.',
                emptyMessage: 'Nenhuma tarefa com esses filtros.',
                renderGroupTitle: (group) => group.label,
              }}
              onRecordChange={({ record }) => {
                setTasks((current) =>
                  current.map((task) =>
                    task.id === record.id ? record : task,
                  ),
                )
                return true
              }}
              renderGalleryRecord={renderTaskGalleryCard(updateTask)}
              renderKanbanRecord={renderTaskKanbanCard(updateTask)}
              renderListRecord={renderTaskListRow(updateTask)}
            />
          </CollectionFrameBody>

          {layout === 'datatable' ? (
            <CollectionFrameFooter>
              <DataGridPagination table={dataTable} />
            </CollectionFrameFooter>
          ) : null}
          {paginated ? (
            <CollectionFrameFooter>
              <CollectionPagination
                label="Paginação de tarefas"
                onPageChange={setPage}
                page={currentPage}
                pageCount={pageCount}
                pageSize={PAGE_SIZE}
                total={orderedTasks.length}
              />
            </CollectionFrameFooter>
          ) : null}
        </CollectionFrame>
      </CollectionProvider>
    </main>
  )
}

const usage = `
import {
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  CollectionLayoutOutlet,
  CollectionPagination,
  CollectionProvider,
  CollectionToolbar,
  DataGridPagination,
  ViewSettingsMenu,
  ViewSwitcherMenu,
} from '@acme/patterns'

<CollectionProvider
  collection={collection}
  onPreferencesChange={setPreferences}
  preferences={preferences}
>
  <CollectionFrame>
    <CollectionFrameHeader>
      <CollectionToolbar
        startSlot={<ViewSwitcherMenu label={view.label}>{views}</ViewSwitcherMenu>}
        endSlot={
          <ViewSettingsMenu mode={preferences.layout} modes={modes} onModeChange={setLayout}>
            {displayAndFilterSections}
          </ViewSettingsMenu>
        }
      />
    </CollectionFrameHeader>
    <CollectionFrameBody aria-label="Collection">
      <CollectionLayoutOutlet
        collection={collection}
        calendar={{ anchor, getRecordSchedule, renderRecord, timeZone }}
        datagrid={{ table: dataGridTable }}
        datatable={{ table: dataTable }}
        renderGalleryRecord={renderCard}
        renderKanbanRecord={renderKanbanCard}
        renderListRecord={renderRow}
      />
    </CollectionFrameBody>
    <CollectionFrameFooter>
      <DataGridPagination table={dataTable} />
      {/* or, for List and Gallery: */}
      <CollectionPagination label="Pagination" page={page} pageCount={pageCount} onPageChange={setPage} />
    </CollectionFrameFooter>
  </CollectionFrame>
</CollectionProvider>
`

const docs = {
  api: [
    {
      description:
        'Holds the `{ layout, groupBy }` preferences, controlled through `preferences` and `onPreferencesChange` or uncontrolled.',
      name: 'CollectionProvider',
    },
    {
      description:
        'Header, body and footer around the toolbar, the layout and the pagination. `mode="fill"` scrolls the body inside a bounded flex column; `flow` grows and makes the footer sticky.',
      name: 'CollectionFrame',
    },
    {
      description:
        'The default toolbar: `ViewSwitcherMenu` with the saved views in `startSlot`, `ViewSettingsMenu` (layout tabs, display and filter sections) and `Action` in `endSlot`.',
      name: 'CollectionToolbar',
    },
    {
      description:
        'Mounts the active layout. Each layout needs its own prop: `renderListRecord`, `renderKanbanRecord`, `renderGalleryRecord`, `calendar`, `datagrid.table` or `datatable.table`; a missing one throws.',
      name: 'CollectionLayoutOutlet',
    },
    {
      description:
        '`DataGridPagination` translates a TanStack table into `CollectionPagination`. `DataGrid` renders it in its own footer; `DataTable` takes it in `CollectionFrameFooter`. List and Gallery page the records the consumer slices.',
      name: 'CollectionPagination',
    },
  ],
  description: {
    component:
      'The reference collection screen: one task collection in every layout (Table, List, Spreadsheet, Gallery, Kanban and Calendar) behind the default toolbar, with pagination in the footer. Kanban and Calendar show every record, so they have no pagination.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

interface CollectionArgs {
  defaultLayout: CollectionLayout
}

const meta = {
  args: { defaultLayout: 'datatable' },
  argTypes: {
    defaultLayout: {
      control: 'inline-radio',
      options: layoutModes.map((mode) => mode.value),
    },
  },
  parameters: { docs, layout: 'fullscreen' },
  render: function Collection({
    defaultLayout,
  }: Readonly<CollectionArgs>): ReactElement {
    return (
      <CollectionWorkspace defaultLayout={defaultLayout} key={defaultLayout} />
    )
  },
  title: 'Patterns/Collection',
} satisfies Meta<CollectionArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EveryLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Switches through the six layouts from Exibição and checks each one mounts with its pagination.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frameBody = canvasElement.querySelector(
      '[data-slot="collection-frame-body"]',
    )
    if (!(frameBody instanceof HTMLElement)) throw new Error('body não montou')
    const pagination = () =>
      canvas.queryByRole('navigation', { name: /Paginação/ })

    const layouts: readonly [string, () => Element | null, boolean][] = [
      [
        'Lista',
        () => frameBody.querySelector('[data-collection-grouping]'),
        true,
      ],
      ['Planilha', () => within(frameBody).queryByRole('grid'), true],
      [
        'Galeria',
        () => frameBody.querySelector('[data-slot="gallery-view"]'),
        true,
      ],
      ['Kanban', () => frameBody.querySelector('[data-slot="card"]'), false],
      [
        'Calendário',
        () => frameBody.querySelector('[data-calendar-mode]'),
        false,
      ],
      [
        'Tabela',
        () => frameBody.querySelector('[data-slot="data-table"]'),
        true,
      ],
    ]

    for (const [label, find, paginated] of layouts) {
      await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
      await userEvent.click(
        await screen.findByRole('menuitemradio', { name: label }),
      )
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(find()).not.toBe(null))
      if (paginated) await expect(pagination()).not.toBe(null)
      else await expect(pagination()).toBe(null)
    }
  },
  tags: ['!dev', '!autodocs'],
}

export const SavePreference: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A filter change enables Salvar preferência; saving writes it into the active view and disables the action again.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openSettings = async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
      return within(await screen.findByRole('menu'))
    }

    let menu = await openSettings()
    await expect(
      menu.getByRole('menuitem', { name: 'Salvar preferência' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(menu.getByRole('menuitem', { name: 'Prioridade' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Urgente' }),
    )
    await userEvent.keyboard('{Escape}{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBe(null))

    menu = await openSettings()
    const save = menu.getByRole('menuitem', { name: 'Salvar preferência' })
    await expect(save).not.toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(save)

    menu = await openSettings()
    await expect(
      menu.getByRole('menuitem', { name: 'Salvar preferência' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await expect(
      menu.getByRole('menuitem', { name: 'Limpar filtros' }),
    ).not.toHaveAttribute('aria-disabled', 'true')
  },
  tags: ['!dev', '!autodocs'],
}

export const SortAndFilter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Ordenar por and the filters read the task properties: sorting by Estimativa descending puts the longest task first, a Status filter keeps only its tasks, and Limpar filtros resets both.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = within(
      await canvas.findByRole('table', { name: 'Tarefas do lançamento' }),
    )
    const bodyRows = () =>
      table.getAllByRole('row').filter((row) => row.closest('tbody'))
    const openSettings = async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
      return within(await screen.findByRole('menu'))
    }
    const closeSettings = async () => {
      await userEvent.keyboard('{Escape}{Escape}')
      await waitFor(() => expect(screen.queryByRole('menu')).toBe(null))
    }

    let menu = await openSettings()
    await userEvent.click(menu.getByRole('menuitem', { name: 'Ordenar por' }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Estimativa' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Decrescente' }),
    )
    await closeSettings()
    const longest = [...collectionTasks].sort(
      (a, b) => b.estimate - a.estimate,
    )[0]
    await waitFor(() =>
      expect(bodyRows()[0]).toHaveTextContent(longest?.title ?? ''),
    )

    menu = await openSettings()
    await userEvent.click(menu.getByRole('menuitem', { name: 'Status' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Concluída' }),
    )
    await closeSettings()
    const done = collectionTasks.filter((task) => task.status === 'done')
    await waitFor(() =>
      expect(bodyRows()).toHaveLength(Math.min(done.length, PAGE_SIZE)),
    )

    menu = await openSettings()
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await waitFor(() =>
      expect(bodyRows()).toHaveLength(
        Math.min(collectionTasks.length, PAGE_SIZE),
      ),
    )
    await expect(bodyRows()[0]).toHaveTextContent(
      collectionTasks[0]?.title ?? '',
    )
  },
  tags: ['!dev', '!autodocs'],
}
