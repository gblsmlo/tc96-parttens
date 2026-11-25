import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  CalendarBlankIcon,
  CalendarDotsIcon,
  CellSignalFullIcon,
  CellSignalHighIcon,
  CellSignalLowIcon,
  CellSignalMediumIcon,
  ChartPieSliceIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  CircleIcon,
  GridFourIcon,
  HashIcon,
  MinusIcon,
  ProhibitIcon,
  RadioButtonIcon,
  RowsIcon,
  TableIcon,
  TagSimpleIcon,
  TextTIcon,
  UserCircleIcon,
  UserIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import type { ViewSettingsMode, ViewSettingsOption } from '@tc96/ui/patterns'

export type FilterKey = 'assignee' | 'date' | 'priority' | 'status' | 'tags'

export type Filters = Record<FilterKey, readonly string[]>

export const noFilters: Filters = {
  assignee: [],
  date: [],
  priority: [],
  status: [],
  tags: [],
}

export const filterDefinitions = [
  {
    icon: RadioButtonIcon,
    allLabel: 'Todos',
    id: 'status',
    label: 'Status',
    options: ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'],
  },
  {
    icon: UserIcon,
    allLabel: 'Todos',
    id: 'assignee',
    label: 'Responsável',
    options: ['Sem responsável', 'Ana Souza', 'Bruno Lima'],
  },
  {
    icon: CellSignalHighIcon,
    allLabel: 'Todas',
    id: 'priority',
    label: 'Prioridade',
    options: ['Sem prioridade', 'Urgente', 'Alta', 'Média', 'Baixa'],
  },
  {
    icon: TagSimpleIcon,
    allLabel: 'Todas',
    id: 'tags',
    label: 'Tags',
    options: ['Documento', 'Retorno', 'Prazo'],
  },
  {
    icon: CalendarDotsIcon,
    allLabel: 'Todos',
    id: 'date',
    label: 'Prazo',
    options: ['Hoje', 'Esta semana', 'Atrasado', 'Sem prazo'],
  },
] as const

export type ViewLayout = 'datagrid' | 'kanban' | 'list'

export const viewModes: readonly ViewSettingsMode<ViewLayout>[] = [
  { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
  { icon: RowsIcon, label: 'Lista', value: 'list' },
  { icon: TableIcon, label: 'Tabela', value: 'datagrid' },
]

export type SpreadsheetLayout = 'datagrid' | 'datatable' | 'kanban'

export const spreadsheetModes: readonly ViewSettingsMode<SpreadsheetLayout>[] =
  [
    { icon: TableIcon, label: 'Tabela', value: 'datatable' },
    { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
    { icon: TableIcon, label: 'Planilha', value: 'datagrid' },
  ]

export type AgendaLayout = 'calendar' | 'datagrid' | 'kanban' | 'list'

export const agendaModes: readonly ViewSettingsMode<AgendaLayout>[] = [
  { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
  { icon: RowsIcon, label: 'Lista', value: 'list' },
  { icon: TableIcon, label: 'Tabela', value: 'datagrid' },
  { icon: CalendarDotsIcon, label: 'Agenda', value: 'calendar' },
]

export type FieldType = 'date' | 'number' | 'person' | 'select' | 'text'

export const fieldTypes: readonly {
  icon: PhosphorIcon
  label: string
  value: FieldType
}[] = [
  { icon: TextTIcon, label: 'Texto', value: 'text' },
  { icon: RadioButtonIcon, label: 'Seleção', value: 'select' },
  { icon: UserIcon, label: 'Pessoa', value: 'person' },
  { icon: CalendarDotsIcon, label: 'Data', value: 'date' },
  { icon: HashIcon, label: 'Número', value: 'number' },
]

export interface CollectionField {
  id: string
  label: string
  type: FieldType
  visible: boolean
}

export const taskFields: readonly CollectionField[] = [
  { id: 'title', label: 'Título', type: 'text', visible: true },
  { id: 'status', label: 'Status', type: 'select', visible: true },
  { id: 'assignee', label: 'Responsável', type: 'person', visible: true },
  { id: 'due', label: 'Prazo', type: 'date', visible: true },
  { id: 'priority', label: 'Prioridade', type: 'select', visible: false },
  { id: 'estimate', label: 'Estimativa', type: 'number', visible: false },
  { id: 'created', label: 'Criado em', type: 'date', visible: false },
  { id: 'description', label: 'Descrição', type: 'text', visible: false },
]

export type TaskStatus =
  | 'done'
  | 'backlog'
  | 'blocked'
  | 'in-progress'
  | 'in-review'
  | 'todo'

export const statusOptions: readonly ViewSettingsOption<TaskStatus>[] = [
  {
    icon: <CircleDashedIcon aria-hidden="true" />,
    label: 'Backlog',
    value: 'backlog',
  },
  { icon: <CircleIcon aria-hidden="true" />, label: 'A fazer', value: 'todo' },
  {
    icon: (
      <CircleHalfIcon aria-hidden="true" className="text-warning-foreground" />
    ),
    label: 'Em andamento',
    value: 'in-progress',
  },
  {
    icon: (
      <ChartPieSliceIcon
        aria-hidden="true"
        className="text-success-foreground"
      />
    ),
    label: 'Em revisão',
    value: 'in-review',
  },
  {
    icon: (
      <ProhibitIcon
        aria-hidden="true"
        className="text-destructive-foreground"
      />
    ),
    label: 'Bloqueado',
    value: 'blocked',
  },
  {
    icon: (
      <CheckCircleIcon
        aria-hidden="true"
        className="text-primary"
        weight="fill"
      />
    ),
    label: 'Concluído',
    value: 'done',
  },
]

export type TaskPriority = 'high' | 'low' | 'medium' | 'none' | 'urgent'

export const priorityOptions: readonly ViewSettingsOption<TaskPriority>[] = [
  {
    icon: <MinusIcon aria-hidden="true" />,
    label: 'Sem prioridade',
    value: 'none',
  },
  {
    icon: (
      <WarningIcon aria-hidden="true" className="text-destructive-foreground" />
    ),
    label: 'Urgente',
    value: 'urgent',
  },
  {
    icon: <CellSignalFullIcon aria-hidden="true" />,
    label: 'Alta',
    value: 'high',
  },
  {
    icon: <CellSignalMediumIcon aria-hidden="true" />,
    label: 'Média',
    value: 'medium',
  },
  {
    icon: <CellSignalLowIcon aria-hidden="true" />,
    label: 'Baixa',
    value: 'low',
  },
]

export type TaskAssignee = 'ana' | 'bruno' | 'unassigned'

export const assigneeOptions: readonly ViewSettingsOption<TaskAssignee>[] = [
  {
    icon: <UserIcon aria-hidden="true" />,
    label: 'Sem responsável',
    value: 'unassigned',
  },
  {
    icon: <UserCircleIcon aria-hidden="true" />,
    label: 'Ana Souza',
    value: 'ana',
  },
  {
    icon: <UserCircleIcon aria-hidden="true" />,
    label: 'Bruno Lima',
    value: 'bruno',
  },
]

export type DateRange = 'next-week' | 'overdue' | 'this-week' | 'today'

export const dateRangeOptions: readonly ViewSettingsOption<DateRange>[] = [
  { label: 'Hoje', value: 'today' },
  { label: 'Esta semana', value: 'this-week' },
  { label: 'Próxima semana', value: 'next-week' },
  { label: 'Atrasado', value: 'overdue' },
]

export const startDateIcon = CalendarBlankIcon
