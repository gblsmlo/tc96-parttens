import {
  CalendarDotsIcon,
  CellSignalHighIcon,
  GridFourIcon,
  RadioButtonIcon,
  RowsIcon,
  TableIcon,
  TagSimpleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type { ViewSettingsMode } from '@tc96/parttens'

export interface SavedView {
  id: string
  label: string
}

export const savedViews: SavedView[] = [
  { id: 'recent', label: 'Pessoas contatadas recentemente' },
  { id: 'all', label: 'Todas as pessoas' },
  { id: 'overdue', label: 'Aguardando retorno' },
]

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

export const ViewIcon = () => (
  <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
    <GridFourIcon aria-hidden="true" className="size-3" />
  </span>
)
