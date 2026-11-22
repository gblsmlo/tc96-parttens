import type { ViewSettingsMode } from '@tc96/parttens'
import {
  CalendarDaysIcon,
  CircleDotIcon,
  LayoutGridIcon,
  Rows3Icon,
  SignalHighIcon,
  Table2Icon,
  TagsIcon,
  UserRoundIcon,
} from 'lucide-react'

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
    icon: CircleDotIcon,
    id: 'status',
    label: 'Status',
    options: ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'],
  },
  {
    icon: UserRoundIcon,
    id: 'assignee',
    label: 'Responsável',
    options: ['Sem responsável', 'Ana Souza', 'Bruno Lima'],
  },
  {
    icon: SignalHighIcon,
    id: 'priority',
    label: 'Prioridade',
    options: ['Sem prioridade', 'Urgente', 'Alta', 'Média', 'Baixa'],
  },
  {
    icon: TagsIcon,
    id: 'tags',
    label: 'Tags',
    options: ['Documento', 'Retorno', 'Prazo'],
  },
  {
    icon: CalendarDaysIcon,
    id: 'date',
    label: 'Prazo',
    options: ['Hoje', 'Esta semana', 'Atrasado', 'Sem prazo'],
  },
] as const

export type ViewLayout = 'datagrid' | 'kanban' | 'list'

export const viewModes: readonly ViewSettingsMode<ViewLayout>[] = [
  { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
  { icon: Table2Icon, label: 'Tabela', value: 'datagrid' },
]

export type SpreadsheetLayout = 'datagrid' | 'datatable' | 'kanban'

export const spreadsheetModes: readonly ViewSettingsMode<SpreadsheetLayout>[] =
  [
    { icon: Table2Icon, label: 'Tabela', value: 'datatable' },
    { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
    { icon: Table2Icon, label: 'Planilha', value: 'datagrid' },
  ]

export type AgendaLayout = 'calendar' | 'datagrid' | 'kanban' | 'list'

export const agendaModes: readonly ViewSettingsMode<AgendaLayout>[] = [
  { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
  { icon: Table2Icon, label: 'Tabela', value: 'datagrid' },
  { icon: CalendarDaysIcon, label: 'Agenda', value: 'calendar' },
]

export const ViewIcon = () => (
  <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
    <LayoutGridIcon aria-hidden="true" className="size-3" />
  </span>
)
