import {
  ArrowBendUpLeftIcon,
  CalendarBlankIcon,
  CalendarDotsIcon,
  CellSignalHighIcon,
  CellSignalLowIcon,
  CellSignalMediumIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  ClockCounterClockwiseIcon,
  EyeIcon,
  FileTextIcon,
  GridFourIcon,
  HourglassIcon,
  MinusCircleIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  RowsIcon,
  TableIcon,
  TagSimpleIcon,
  UserCircleIcon,
  UserIcon,
  WarningCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import type { Decorator } from '@storybook/react-vite'
import type {
  ViewSettingsFilter,
  ViewSettingsFilterValues,
} from '@tc96/ui/blocks/application/view-settings/view-settings-1'
import { CollectionToolbar } from '@tc96/ui/patterns'

const options = (...labels: string[]) =>
  labels.map((label) => ({ label, value: label }))

export const taskFilters: readonly ViewSettingsFilter[] = [
  {
    allLabel: 'Todos',
    icon: RadioButtonIcon,
    id: 'status',
    label: 'Status',
    options: options('A fazer', 'Em andamento', 'Em revisão', 'Concluído'),
  },
  {
    allLabel: 'Todos',
    icon: UserIcon,
    id: 'assignee',
    label: 'Responsável',
    options: options('Sem responsável', 'Ana Souza', 'Bruno Lima'),
  },
  {
    allLabel: 'Todas',
    icon: CellSignalHighIcon,
    id: 'priority',
    label: 'Prioridade',
    options: options('Sem prioridade', 'Urgente', 'Alta', 'Média', 'Baixa'),
  },
  {
    allLabel: 'Todas',
    icon: TagSimpleIcon,
    id: 'tags',
    label: 'Tags',
    options: options('Documento', 'Retorno', 'Prazo'),
  },
  {
    allLabel: 'Todos',
    icon: CalendarDotsIcon,
    id: 'date',
    label: 'Prazo',
    options: options('Hoje', 'Esta semana', 'Atrasado', 'Sem prazo'),
  },
]

export const noFilterValues: ViewSettingsFilterValues = {}

export type TaskSort = 'due' | 'updated'

export const taskSortOptions = [
  { label: 'Prazo', value: 'due' },
  { label: 'Atualização', value: 'updated' },
] as const

export type BoardMode = 'datagrid' | 'kanban' | 'list'

export const boardModes = [
  { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
  { icon: RowsIcon, label: 'Lista', value: 'list' },
  { icon: TableIcon, label: 'Tabela', value: 'datagrid' },
] as const

export type SpreadsheetMode = 'datagrid' | 'kanban' | 'sheet'

export const spreadsheetModes = [
  { icon: TableIcon, label: 'Tabela', value: 'datagrid' },
  { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
  { icon: RowsIcon, label: 'Planilha', value: 'sheet' },
] as const

export type AgendaMode = BoardMode | 'agenda'

export const agendaModes = [
  ...boardModes,
  { icon: CalendarBlankIcon, label: 'Agenda', value: 'agenda' },
] as const

export const ViewSettingsToolbar: Decorator = (Story) => (
  <div className="flex justify-center p-6">
    <CollectionToolbar right={<Story />} />
  </div>
)

const optionIcons: Readonly<Record<string, PhosphorIcon>> = {
  'A fazer': CircleDashedIcon,
  'Ana Souza': UserCircleIcon,
  Alta: CellSignalHighIcon,
  Atrasado: WarningCircleIcon,
  Baixa: CellSignalLowIcon,
  'Bruno Lima': UserCircleIcon,
  Concluído: CheckCircleIcon,
  Documento: FileTextIcon,
  'Em andamento': CircleHalfIcon,
  'Em revisão': EyeIcon,
  'Esta semana': CalendarDotsIcon,
  Hoje: CalendarBlankIcon,
  Média: CellSignalMediumIcon,
  Prazo: HourglassIcon,
  Retorno: ArrowBendUpLeftIcon,
  'Sem prazo': MinusCircleIcon,
  'Sem prioridade': MinusCircleIcon,
  'Sem responsável': UserIcon,
  Urgente: WarningIcon,
}

const withIcon = (label: string) => {
  const Icon = optionIcons[label]
  return Icon ? <Icon aria-hidden="true" /> : undefined
}

export const taskFiltersWithIcons: readonly ViewSettingsFilter[] =
  taskFilters.map((filter) => ({
    ...filter,
    options: filter.options.map((option) => ({
      ...option,
      icon: withIcon(option.label),
    })),
  }))

export const taskSortOptionsWithIcons = [
  {
    icon: <CalendarDotsIcon aria-hidden="true" />,
    label: 'Prazo',
    value: 'due',
  },
  {
    icon: <ClockCounterClockwiseIcon aria-hidden="true" />,
    label: 'Atualização',
    value: 'updated',
  },
] as const
