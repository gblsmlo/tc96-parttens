import {
  ArrowsDownUpIcon,
  CalendarDotIcon,
  CalendarDotsIcon,
  CalendarIcon,
  CardsIcon,
  ClockIcon,
  FlagIcon,
  GridFourIcon,
  ListBulletsIcon,
  RadioButtonIcon,
  RowsIcon,
  TableIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import {
  Action,
  type CalendarViewMode,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  type CollectionFrameMode,
  type CollectionLayout,
  CollectionLayoutOutlet,
  CollectionPagination,
  type CollectionPreferences,
  CollectionProvider,
  CollectionSearchField,
  CollectionToolbar,
  DataGridColumnsSubmenu,
  DataGridDensitySubmenu,
  DataGridPagination,
  FilterRadioSubmenu,
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
import { Separator } from '@tc96/ui/separator'
import {
  type ComponentType,
  type ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react'
import type { CollectionControls } from './collection-controls'
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

export const PAGE_SIZE = 16

const sampleTasks = collectionTasks.slice(0, 18)

const layoutModes: readonly ViewSettingsMode<CollectionLayout>[] = [
  { icon: TableIcon, label: 'Tabela', value: 'datatable' },
  { icon: RowsIcon, label: 'Lista', value: 'list' },
  { icon: TableIcon, label: 'Planilha', value: 'datagrid' },
  { icon: CardsIcon, label: 'Galeria', value: 'gallery' },
  { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
  { icon: CalendarDotsIcon, label: 'Calendário', value: 'calendar' },
]

const calendarModes: readonly { label: string; value: CalendarViewMode }[] = [
  { label: 'Mês', value: 'month' },
  { label: 'Semana', value: 'week' },
  { label: 'Dia', value: 'day' },
]

const isCalendarMode = (value: string): value is CalendarViewMode =>
  calendarModes.some((mode) => mode.value === value)

const dueOptions = taskDueFilters.map(
  (filter) => [filter.value, filter.label] as const,
)

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

const matchesSearch = (task: Task, search: string) =>
  task.title
    .toLocaleLowerCase('pt-BR')
    .includes(search.toLocaleLowerCase('pt-BR'))

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

const viewIcon = (
  <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
    <GridFourIcon aria-hidden="true" className="size-3" />
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
            <MenuCheckboxItem
              checked={selected.includes(option.value)}
              closeOnClick={false}
              key={option.value}
              onCheckedChange={() => onToggle(option.value)}
            >
              {option.label}
            </MenuCheckboxItem>
          ))}
        </MenuGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}

export interface CollectionScreenProps {
  actionLabel?: string
  defaultLayout: CollectionLayout
  emptyMessage: string
  initialTasks: readonly Task[]
  loading: boolean
  mode: CollectionFrameMode
  pagination: boolean
  search: boolean
  toolbar: boolean
}

export function CollectionScreen({
  actionLabel,
  defaultLayout,
  emptyMessage,
  initialTasks,
  loading,
  mode,
  pagination,
  search: withSearch,
  toolbar,
}: Readonly<CollectionScreenProps>): ReactElement {
  const [tasks, setTasks] = useState<Task[]>(() => [...initialTasks])
  const [preferences, setPreferences] = useState<CollectionPreferences>({
    groupBy: 'status',
    layout: defaultLayout,
  })
  const [views, setViews] = useState(() => createSavedViews(defaultLayout))
  const [viewId, setViewId] = useState('all')
  const [viewQuery, setViewQuery] = useState('')
  const [search, setSearch] = useState('')
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
            matchesSearch(task, search) &&
            matchesTaskQuery(task, query),
        ),
        query.sort,
      ),
    [activeView.scope, query, search, tasks],
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
  const paginated = pagination && (layout === 'list' || layout === 'gallery')
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
    enablePagination: pagination,
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
    enablePagination: pagination,
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
    <main
      className={
        mode === 'fill'
          ? 'mx-auto flex h-dvh w-full max-w-7xl flex-col gap-4 p-6'
          : 'mx-auto flex w-full max-w-7xl flex-col gap-4 p-6'
      }
    >
      <CollectionProvider
        collection={collection}
        onPreferencesChange={(next) => {
          setPreferences(next)
          setPage(1)
        }}
        preferences={preferences}
      >
        <CollectionFrame mode={mode}>
          {toolbar ? (
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
                      onModeChange={(next) => {
                        setPreferences((current) => ({
                          ...current,
                          layout: next,
                        }))
                        setPage(1)
                      }}
                      onSavePreference={saveView}
                      savePreferenceDisabled={!viewModified}
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
                                  setPreferences((current) => ({
                                    ...current,
                                    groupBy: groupBy || null,
                                  }))
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
                                onValueChange={(next: string) => {
                                  if (isCalendarMode(next))
                                    setCalendarMode(next)
                                }}
                                value={calendarMode}
                              >
                                {calendarModes.map((calendarOption) => (
                                  <MenuRadioItem
                                    key={calendarOption.value}
                                    value={calendarOption.value}
                                  >
                                    {calendarOption.label}
                                  </MenuRadioItem>
                                ))}
                              </MenuRadioGroup>
                            </MenuSubPopup>
                          </MenuSub>
                        ) : (
                          <MenuSub>
                            <MenuSubTrigger>
                              <ArrowsDownUpIcon aria-hidden="true" />
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
                                  <MenuRadioItem value="">
                                    Sem ordenação
                                  </MenuRadioItem>
                                  {taskSortFields.map((field) => (
                                    <MenuRadioItem
                                      key={field.value}
                                      value={field.value}
                                    >
                                      {field.label}
                                    </MenuRadioItem>
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
                                  <MenuRadioItem
                                    disabled={!query.sort}
                                    value="asc"
                                  >
                                    Crescente
                                  </MenuRadioItem>
                                  <MenuRadioItem
                                    disabled={!query.sort}
                                    value="desc"
                                  >
                                    Decrescente
                                  </MenuRadioItem>
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
                          icon={RadioButtonIcon}
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
                              assigneeIds: toggle(
                                query.assigneeIds,
                                assigneeId,
                              ),
                            })
                          }
                          options={people.map((person) => ({
                            label: person.name,
                            value: person.id,
                          }))}
                          selected={query.assigneeIds}
                        />
                        <FilterRadioSubmenu
                          clearLabel="Qualquer prazo"
                          icon={CalendarDotIcon}
                          label="Prazo"
                          onValueChange={(due) =>
                            updateQuery({
                              due: isTaskDueFilter(due) ? due : null,
                            })
                          }
                          options={dueOptions}
                          value={query.due ?? ''}
                        />
                        <CheckboxFilterSubmenu
                          icon={ClockIcon}
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
                    {actionLabel ? (
                      <Action label={actionLabel} onClick={() => undefined} />
                    ) : null}
                  </>
                }
                startSlot={
                  <>
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
                    {withSearch ? (
                      <CollectionSearchField
                        label="Buscar tarefas"
                        onCommit={(next) => {
                          setSearch(next)
                          setPage(1)
                        }}
                        placeholder="Buscar tarefas"
                        value={search}
                      />
                    ) : null}
                  </>
                }
                variant="plain"
              />
            </CollectionFrameHeader>
          ) : null}

          <CollectionFrameBody aria-label="Visualização da coleção">
            <CollectionLayoutOutlet
              calendar={{
                ...createTaskCalendarProps(updateTask),
                mode: calendarMode,
              }}
              collection={collection}
              datagrid={{
                'aria-label': 'Tarefas do lançamento',
                emptyMessage,
                getRowGroup: grouping ? groupRowLabel : undefined,
                table: dataGridTable,
              }}
              datatable={{
                'aria-label': 'Tarefas do lançamento',
                bordered: true,
                defaultAggregations: taskTableAggregations,
                emptyMessage,
                table: dataTable,
              }}
              gallery={{ emptyMessage }}
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
                emptyMessage,
                renderGroupTitle: (group) => group.label,
              }}
              loading={loading}
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

          {pagination && layout === 'datatable' ? (
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

export const ComposedCollection = ({
  action,
  actionLabel,
  empty,
  emptyMessage,
  layout,
  loading,
  mode,
  pagination,
  search,
  toolbar,
}: Readonly<CollectionControls>) => (
  <CollectionScreen
    actionLabel={action ? actionLabel || 'Adicionar' : undefined}
    defaultLayout={layout}
    emptyMessage={emptyMessage}
    initialTasks={empty ? [] : sampleTasks}
    key={[layout, empty, pagination].join()}
    loading={loading}
    mode={mode}
    pagination={pagination}
    search={search}
    toolbar={toolbar}
  />
)
