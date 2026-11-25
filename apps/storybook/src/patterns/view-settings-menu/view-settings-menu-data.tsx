import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  CalendarDotsIcon,
  CellSignalHighIcon,
  GridFourIcon,
  HashIcon,
  RadioButtonIcon,
  RowsIcon,
  TableIcon,
  TagSimpleIcon,
  TextTIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type { ViewSettingsMode } from '@tc96/ui/patterns'

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
    id: 'status',
    label: 'Status',
    options: ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'],
  },
  {
    icon: UserIcon,
    id: 'assignee',
    label: 'Responsável',
    options: ['Sem responsável', 'Ana Souza', 'Bruno Lima'],
  },
  {
    icon: CellSignalHighIcon,
    id: 'priority',
    label: 'Prioridade',
    options: ['Sem prioridade', 'Urgente', 'Alta', 'Média', 'Baixa'],
  },
  {
    icon: TagSimpleIcon,
    id: 'tags',
    label: 'Tags',
    options: ['Documento', 'Retorno', 'Prazo'],
  },
  {
    icon: CalendarDotsIcon,
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
