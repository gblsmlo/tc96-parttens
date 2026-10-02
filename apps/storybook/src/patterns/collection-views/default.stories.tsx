import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  ActionBar,
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarEventChipTone,
  type CalendarItemRenderContext,
  type CalendarViewMode,
  type CollectionDefinition,
  CollectionProvider,
  CollectionSearchField,
  CollectionToolbar,
  type CollectionViewMode,
  CollectionViewOutlet,
  createSelectColumn,
  type DataGridColumnDef,
  DataGridColumnsSubmenu,
  DataGridDensitySubmenu,
  DataGridPagination,
  DataGridSortSubmenu,
  type DataTableColumnDef,
  DateProperty,
  KanbanCard,
  KanbanCardBody,
  KanbanCardBodyRow,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  type KanbanCardMove,
  KanbanCardTitle,
  ListItem,
  ListItemBody,
  ListItemDescription,
  ListItemField,
  ListItemTitle,
  ListItemTitleTrigger,
  ListItemTrailing,
  PersonProperty,
  type PersonPropertyOption,
  PresetsMenu,
  SelectProperty,
  type SelectPropertyOption,
  TextProperty,
  useCollectionPreferences,
  useDataGrid,
  useDataTable,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/parttens'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
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
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  EyeIcon,
  FlagIcon,
  LayoutGridIcon,
  ListIcon,
  Rows3Icon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
  Table2Icon,
  TableIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UsersIcon,
} from 'lucide-react'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

// ─── Domínio ────────────────────────────────────────────────────────────────

type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

interface Task {
  assigneeId: string
  description: string
  /** Fim da janela; `null` é tarefa só com prazo. */
  end: string | null
  /** Horas estimadas. */
  estimate: number
  id: string
  isAllDay?: boolean
  priority: TaskPriority
  start: string
  status: TaskStatus
  title: string
}

interface Person {
  id: string
  initials: string
  name: string
}

const TIME_ZONE = 'America/Sao_Paulo'
// Âncora e "agora" fixos mantêm a vitrine determinística entre execuções.
const ANCHOR = new Date('2026-10-14T15:00:00.000Z')
const NOW = new Date('2026-10-14T16:30:00.000Z')

const people: readonly Person[] = [
  { id: 'ana', initials: 'AS', name: 'Ana Souza' },
  { id: 'bruno', initials: 'BL', name: 'Bruno Lima' },
  { id: 'carla', initials: 'CM', name: 'Carla Mendes' },
  { id: 'diego', initials: 'DR', name: 'Diego Rocha' },
]

const peopleById = new Map(people.map((person) => [person.id, person]))

const statusOptions = [
  {
    icon: CircleDashedIcon,
    label: 'Backlog',
    tone: 'neutral',
    value: 'backlog',
  },
  { icon: CircleIcon, label: 'A fazer', tone: 'neutral', value: 'todo' },
  {
    icon: CircleDotIcon,
    label: 'Em andamento',
    tone: 'info',
    value: 'in-progress',
  },
  { icon: EyeIcon, label: 'Em revisão', tone: 'warning', value: 'review' },
  { icon: CircleCheckIcon, label: 'Concluída', tone: 'success', value: 'done' },
] as const satisfies readonly (SelectPropertyOption & { value: TaskStatus })[]

const priorityOptions = [
  {
    icon: TriangleAlertIcon,
    label: 'Urgente',
    tone: 'danger',
    value: 'urgent',
  },
  { icon: SignalHighIcon, label: 'Alta', tone: 'warning', value: 'high' },
  { icon: SignalMediumIcon, label: 'Média', tone: 'info', value: 'medium' },
  { icon: SignalLowIcon, label: 'Baixa', tone: 'neutral', value: 'low' },
] as const satisfies readonly (SelectPropertyOption & {
  value: TaskPriority
})[]

const isStatus = (value: string): value is TaskStatus =>
  statusOptions.some((option) => option.value === value)

const isPriority = (value: string): value is TaskPriority =>
  priorityOptions.some((option) => option.value === value)

const initialTasks: Task[] = [
  {
    assigneeId: 'ana',
    description: 'Fluxo de cadastro com e-mail e login social no app.',
    end: '2026-10-14T19:00:00.000Z',
    estimate: 16,
    id: 'TSK-101',
    priority: 'urgent',
    start: '2026-10-14T17:00:00.000Z',
    status: 'in-progress',
    title: 'Implementar onboarding',
  },
  {
    assigneeId: 'bruno',
    description:
      'Revisar contratos dos endpoints de pagamento com o time de backend.',
    end: '2026-10-13T15:30:00.000Z',
    estimate: 4,
    id: 'TSK-102',
    priority: 'high',
    start: '2026-10-13T14:00:00.000Z',
    status: 'review',
    title: 'Revisar API de pagamentos',
  },
  {
    assigneeId: 'carla',
    description: 'Telas finais de checkout e estados de erro no Figma.',
    end: null,
    estimate: 12,
    id: 'TSK-103',
    priority: 'high',
    start: '2026-10-15T20:00:00.000Z',
    status: 'todo',
    title: 'Entregar design do checkout',
  },
  {
    assigneeId: 'diego',
    description: 'Pipeline de build para as lojas com assinatura automática.',
    end: '2026-10-12T18:00:00.000Z',
    estimate: 8,
    id: 'TSK-104',
    priority: 'medium',
    start: '2026-10-12T16:00:00.000Z',
    status: 'done',
    title: 'Configurar CI mobile',
  },
  {
    assigneeId: 'ana',
    description: 'Disparo de push transacional para pedidos e lembretes.',
    end: null,
    estimate: 10,
    id: 'TSK-105',
    priority: 'medium',
    start: '2026-10-19T21:00:00.000Z',
    status: 'backlog',
    title: 'Notificações push',
  },
  {
    assigneeId: 'bruno',
    description: 'Cobrir o fluxo de compra com testes ponta a ponta.',
    end: '2026-10-16T17:00:00.000Z',
    estimate: 6,
    id: 'TSK-106',
    priority: 'high',
    start: '2026-10-16T13:00:00.000Z',
    status: 'todo',
    title: 'Testes E2E do checkout',
  },
  {
    assigneeId: 'carla',
    description: 'Planejamento do sprint com produto e engenharia.',
    end: '2026-10-14T14:00:00.000Z',
    estimate: 2,
    id: 'TSK-107',
    priority: 'low',
    start: '2026-10-14T13:00:00.000Z',
    status: 'done',
    title: 'Planning do sprint 21',
  },
  {
    assigneeId: 'diego',
    description: 'Janela de congelamento de código antes do envio às lojas.',
    end: '2026-10-23T03:00:00.000Z',
    estimate: 0,
    id: 'TSK-108',
    isAllDay: true,
    priority: 'urgent',
    start: '2026-10-21T03:00:00.000Z',
    status: 'todo',
    title: 'Code freeze da versão 2.0',
  },
  {
    assigneeId: 'ana',
    description: 'Ajustar contraste e rótulos para leitores de tela.',
    end: null,
    estimate: 5,
    id: 'TSK-109',
    priority: 'medium',
    start: '2026-10-20T18:00:00.000Z',
    status: 'in-progress',
    title: 'Auditoria de acessibilidade',
  },
  {
    assigneeId: 'bruno',
    description: 'Eventos de funil e painel de conversão do lançamento.',
    end: null,
    estimate: 7,
    id: 'TSK-110',
    priority: 'low',
    start: '2026-10-27T20:00:00.000Z',
    status: 'backlog',
    title: 'Instrumentar analytics',
  },
  {
    assigneeId: 'carla',
    description: 'Capturas, descrição e palavras-chave para App Store e Play.',
    end: '2026-10-22T18:00:00.000Z',
    estimate: 6,
    id: 'TSK-111',
    priority: 'medium',
    start: '2026-10-22T15:00:00.000Z',
    status: 'todo',
    title: 'Material das lojas',
  },
  {
    assigneeId: 'diego',
    description: 'Corrigir quedas reportadas no Android 15.',
    end: null,
    estimate: 9,
    id: 'TSK-112',
    priority: 'urgent',
    start: '2026-10-15T15:00:00.000Z',
    status: 'in-progress',
    title: 'Crash no Android 15',
  },
  {
    assigneeId: 'ana',
    description: 'Demo da versão beta para os stakeholders.',
    end: '2026-10-28T18:00:00.000Z',
    estimate: 1,
    id: 'TSK-113',
    priority: 'high',
    start: '2026-10-28T17:00:00.000Z',
    status: 'todo',
    title: 'Demo da beta',
  },
  {
    assigneeId: 'bruno',
    description: 'Documentar decisões de arquitetura do módulo offline.',
    end: null,
    estimate: 3,
    id: 'TSK-114',
    priority: 'low',
    start: '2026-10-09T19:00:00.000Z',
    status: 'review',
    title: 'ADR do modo offline',
  },
]

const STATUS_TONE: Record<TaskStatus, CalendarEventChipTone> = {
  backlog: 'neutral',
  done: 'success',
  'in-progress': 'primary',
  review: 'warning',
  todo: 'neutral',
}

const groupings: CollectionDefinition<Task>['groupings'] = [
  {
    getGroupId: (task) => task.status,
    id: 'status',
    label: 'Status',
    options: statusOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
  },
  {
    getGroupId: (task) => task.assigneeId,
    id: 'assignee',
    label: 'Responsável',
    options: people.map((person) => ({ id: person.id, label: person.name })),
  },
  {
    getGroupId: (task) => task.priority,
    id: 'priority',
    label: 'Prioridade',
    options: priorityOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
  },
]

const createCollection = (
  items: readonly Task[],
): CollectionDefinition<Task> => ({
  getKey: (task) => task.id,
  getLabel: (task) => task.title,
  groupings,
  items,
})

// ─── Formatação ─────────────────────────────────────────────────────────────

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

const formatMinutes = (minutes: number | null) => {
  if (minutes === null) return null
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0')
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`
}

// ─── Peças compartilhadas pelas views ───────────────────────────────────────

type TaskChange = Partial<Omit<Task, 'id'>>
type UpdateTask = (id: string, change: TaskChange) => void

function StatusField({
  onChange,
  task,
}: Readonly<{ onChange: UpdateTask; task: Task }>) {
  return (
    <SelectProperty
      ariaLabel="Status"
      onValueChange={(value) => {
        if (value && isStatus(value)) onChange(task.id, { status: value })
      }}
      options={statusOptions}
      value={task.status}
    />
  )
}

const personOptions: readonly PersonPropertyOption[] = people.map((person) => ({
  fallback: person.initials,
  label: person.name,
  value: person.id,
}))

function AssigneeField({
  display = 'full',
  onChange,
  task,
}: Readonly<{
  display?: 'avatar' | 'full'
  onChange: UpdateTask
  task: Task
}>) {
  return (
    <PersonProperty
      ariaLabel="Responsável"
      display={display}
      onValueChange={(value) => onChange(task.id, { assigneeId: value })}
      options={personOptions}
      value={task.assigneeId}
    />
  )
}

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: TIME_ZONE,
  year: 'numeric',
})

/** Dia civil no fuso da coleção, como `YYYY-MM-DD`. */
const dayKey = (iso: string) => dayKeyFormatter.format(new Date(iso))

const dueOf = (task: Task) => task.end ?? task.start

/**
 * Mudar o prazo desloca a janela inteira pelos dias de diferença: início e fim
 * andam juntos, e o horário de cada um se mantém — o Calendário segue coerente.
 */
const moveDue = (task: Task, picked: string): TaskChange => {
  const delta =
    Date.parse(`${dayKey(picked)}T00:00:00Z`) -
    Date.parse(`${dayKey(dueOf(task))}T00:00:00Z`)
  const shift = (iso: string) => new Date(Date.parse(iso) + delta).toISOString()

  return { end: task.end ? shift(task.end) : null, start: shift(task.start) }
}

function DueField({
  onChange,
  task,
  variant,
}: Readonly<{
  onChange: UpdateTask
  task: Task
  variant?: 'badge' | 'plain'
}>) {
  return (
    <DateProperty
      allowClear={false}
      ariaLabel="Prazo"
      isOverdue={
        task.status !== 'done' && Date.parse(dueOf(task)) < NOW.getTime()
      }
      locale="pt-BR"
      onValueChange={(value) => {
        if (value) onChange(task.id, moveDue(task, value))
      }}
      timeZone={TIME_ZONE}
      value={dueOf(task)}
      variant={variant}
    />
  )
}

function EstimateField({
  onChange,
  task,
}: Readonly<{ onChange: UpdateTask; task: Task }>) {
  return (
    <TextProperty
      ariaLabel="Estimativa"
      editing="inline"
      fallback="Sem estimativa"
      inputPlaceholder="Ex.: 8 h"
      onCommit={(value) => {
        const hours = Number.parseFloat(value ?? '')
        onChange(task.id, {
          estimate: Number.isFinite(hours) && hours >= 0 ? hours : 0,
        })
      }}
      value={`${task.estimate} h`}
    />
  )
}

function PriorityField({
  onChange,
  task,
}: Readonly<{ onChange: UpdateTask; task: Task }>) {
  return (
    <SelectProperty
      ariaLabel="Prioridade"
      onValueChange={(value) => {
        if (value && isPriority(value)) onChange(task.id, { priority: value })
      }}
      options={priorityOptions}
      value={task.priority}
    />
  )
}

// ─── Colunas das tabelas ────────────────────────────────────────────────────

/**
 * As células da planilha são as properties da UI: o grid só posiciona, e cada
 * property abre o próprio controle e avisa a troca para a coleção.
 */
const createDataGridColumns = (
  onChange: UpdateTask,
): DataGridColumnDef<Task>[] => [
  createSelectColumn<Task>(),
  {
    accessorKey: 'title',
    enableHiding: false,
    header: 'Tarefa',
    meta: { label: 'Tarefa', type: 'title' },
    minSize: 240,
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => <StatusField onChange={onChange} task={row.original} />,
    header: 'Status',
    meta: { label: 'Status', type: 'status' },
    minSize: 170,
  },
  {
    accessorKey: 'priority',
    cell: ({ row }) => (
      <PriorityField onChange={onChange} task={row.original} />
    ),
    header: 'Prioridade',
    meta: { label: 'Prioridade', type: 'select' },
    minSize: 150,
  },
  {
    accessorKey: 'assigneeId',
    cell: ({ row }) => (
      <AssigneeField onChange={onChange} task={row.original} />
    ),
    header: 'Responsável',
    meta: { label: 'Responsável', type: 'person' },
    minSize: 190,
  },
  {
    accessorFn: dueOf,
    cell: ({ row }) => <DueField onChange={onChange} task={row.original} />,
    header: 'Prazo',
    id: 'due',
    meta: { label: 'Prazo', type: 'date' },
    minSize: 150,
  },
  {
    accessorKey: 'estimate',
    cell: ({ row }) => (
      <EstimateField onChange={onChange} task={row.original} />
    ),
    header: 'Estimativa',
    meta: { label: 'Estimativa', type: 'number' },
    minSize: 150,
  },
]

const createDataTableColumns = (
  onChange: UpdateTask,
): DataTableColumnDef<Task>[] => [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Selecionar ${row.original.title}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    header: ({ table }) => (
      <Checkbox
        aria-label="Selecionar todas as tarefas"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    id: 'select',
  },
  {
    accessorKey: 'title',
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">{row.original.title}</span>
        <span className="truncate text-muted-foreground text-xs">
          {row.original.id} · {row.original.description}
        </span>
      </div>
    ),
    footer: ({ table }) => `${table.getRowCount()} tarefas`,
    header: 'Tarefa',
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => <StatusField onChange={onChange} task={row.original} />,
    header: 'Status',
  },
  {
    accessorKey: 'priority',
    cell: ({ row }) => (
      <PriorityField onChange={onChange} task={row.original} />
    ),
    header: 'Prioridade',
  },
  {
    accessorKey: 'assigneeId',
    cell: ({ row }) => (
      <AssigneeField onChange={onChange} task={row.original} />
    ),
    header: 'Responsável',
  },
  {
    cell: ({ row }) => <DueField onChange={onChange} task={row.original} />,
    header: 'Prazo',
    id: 'due',
  },
  {
    accessorKey: 'estimate',
    cell: ({ row }) => (
      <EstimateField onChange={onChange} task={row.original} />
    ),
    footer: ({ table }) => (
      <span className="tabular-nums">
        {table
          .getPrePaginatedRowModel()
          .rows.reduce((sum, row) => sum + row.original.estimate, 0)}{' '}
        h
      </span>
    ),
    header: 'Estimativa',
  },
]

// ─── Toolbar ────────────────────────────────────────────────────────────────

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

/** "Minhas tarefas" é da Ana, a pessoa logada na vitrine. */
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

// ─── Vitrine ────────────────────────────────────────────────────────────────

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

  // As tabelas agrupam linhas consecutivas: a ordem segue a do agrupamento.
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

  const moveCard = ({ card, targetColumnId }: KanbanCardMove<Task>) => {
    if (preferences.groupBy === 'status' && isStatus(targetColumnId))
      updateTask(card.id, { status: targetColumnId })
    else if (preferences.groupBy === 'priority' && isPriority(targetColumnId))
      updateTask(card.id, { priority: targetColumnId })
    else if (
      preferences.groupBy === 'assignee' &&
      peopleById.has(targetColumnId)
    )
      updateTask(card.id, { assigneeId: targetColumnId })
    else return false
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
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="font-semibold text-2xl">Lançamento do app 2.0</h1>
          <p className="text-muted-foreground text-sm">
            Todas as tarefas do lançamento em uma coleção — troque a view em
            Exibição.
          </p>
        </div>
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
                            <MenuRadioItem key={mode.value} value={mode.value}>
                              {mode.label}
                            </MenuRadioItem>
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
      </header>

      <section
        aria-label="Visualização da coleção"
        className="flex min-h-0 flex-1 flex-col gap-2"
      >
        <CollectionViewOutlet
          calendar={{
            anchor: ANCHOR,
            getItemSchedule: (task) => ({
              end: task.end ? new Date(task.end) : null,
              isAllDay: task.isAllDay ?? false,
              start: new Date(task.start),
            }),
            loadingItemLabel: 'Carregando tarefa',
            mode: calendarMode,
            now: NOW,
            onItemReschedule: ({ end, isAllDay, item, start }) => {
              updateTask(item.id, {
                end: end?.toISOString() ?? null,
                isAllDay,
                start: start.toISOString(),
              })
              return true
            },
            renderItem: (task: Task, context: CalendarItemRenderContext) => {
              const inTimeGrid = context.placement === 'time-grid'
              return (
                <CalendarEventChip
                  completed={task.status === 'done'}
                  display={inTimeGrid ? 'block' : 'chip'}
                  tone={
                    task.priority === 'urgent' && task.status !== 'done'
                      ? 'destructive'
                      : STATUS_TONE[task.status]
                  }
                >
                  {inTimeGrid ? (
                    <CalendarEventChipTime>
                      {formatMinutes(context.startMinutes)}
                    </CalendarEventChipTime>
                  ) : task.isAllDay ? null : (
                    <CalendarEventChipTime>
                      {timeFormatter.format(new Date(task.start))}
                    </CalendarEventChipTime>
                  )}
                  <CalendarEventChipTitle>{task.title}</CalendarEventChipTitle>
                  <CalendarEventChipOpenTrigger
                    aria-label={`Abrir ${task.title}`}
                  />
                </CalendarEventChip>
              )
            },
            timeZone: TIME_ZONE,
            weekStartsOn: 1,
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
          renderKanbanItem={(task) => (
            <KanbanCard key={task.id} variant="interactive">
              <KanbanCardHeader>
                <KanbanCardTitle>{task.title}</KanbanCardTitle>
                <KanbanCardDescription>
                  {task.description}
                </KanbanCardDescription>
              </KanbanCardHeader>
              <KanbanCardBody>
                <KanbanCardBodyRow data-kanban-card-action="">
                  {preferences.groupBy === 'status' ? (
                    <PriorityField onChange={updateTask} task={task} />
                  ) : (
                    <StatusField onChange={updateTask} task={task} />
                  )}
                </KanbanCardBodyRow>
              </KanbanCardBody>
              <KanbanCardFooter>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3 text-muted-foreground text-xs">
                  <DueField onChange={updateTask} task={task} />
                  <AssigneeField
                    display="avatar"
                    onChange={updateTask}
                    task={task}
                  />
                </div>
              </KanbanCardFooter>
            </KanbanCard>
          )}
          renderListItem={(task) => (
            <ListItem key={task.id}>
              <ListItemBody>
                <ListItemTitle>
                  <ListItemTitleTrigger>{task.title}</ListItemTitleTrigger>
                </ListItemTitle>
                <ListItemDescription>
                  {task.id} · {task.description}
                </ListItemDescription>
              </ListItemBody>
              <ListItemTrailing>
                <ListItemField>
                  <StatusField onChange={updateTask} task={task} />
                </ListItemField>
                <ListItemField>
                  <PriorityField onChange={updateTask} task={task} />
                </ListItemField>
                <ListItemField>
                  <DueField onChange={updateTask} task={task} />
                </ListItemField>
                <ListItemField always>
                  <AssigneeField
                    display="avatar"
                    onChange={updateTask}
                    task={task}
                  />
                </ListItemField>
              </ListItemTrailing>
            </ListItem>
          )}
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
          'Vitrine das collection views sobre uma mesma coleção real: as tarefas do lançamento de um app.',
          'O `ViewSettingsMenu` alterna entre **Lista**, **Kanban**, **Calendário**, **Planilha** (DataGrid) e **Tabela** (DataTable), e reúne agrupamento, período do calendário, ordenação, densidade, colunas e filtros por responsável e prioridade.',
          'Toda edição volta para a mesma coleção — mover o card no Kanban, reagendar no Calendário ou trocar status e prioridade nas tabelas aparece em todas as views.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews',
} satisfies Meta<typeof CollectionViewsShowcase>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Percorre as cinco views pelas tabs do `ViewSettingsMenu` e confirma que cada
 * uma monta sobre a mesma coleção.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // O popup do menu sai em portal — vive fora de `canvasElement`.
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

/** Trocar o status na Tabela reescreve a tarefa na coleção compartilhada. */
export const SharedEdits: Story = {
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

/** Na Planilha, cada coluna de valor é uma property da UI — até o Prazo. */
export const SpreadsheetProperties: Story = {
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
    const row = (await canvas.findByText('Code freeze da versão 2.0')).closest('tr')
    if (!row) throw new Error('linha não montou')
    await expect(within(row).getByText('Carla Mendes')).toBeTruthy()
  },
}
