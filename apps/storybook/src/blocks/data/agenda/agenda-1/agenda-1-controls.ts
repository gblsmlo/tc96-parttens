import type { ArgTypes } from '@storybook/react-vite'
import type {
  Agenda1Mode,
  Agenda1Period,
} from '@tc96/ui/blocks/data/agenda/agenda-1'

export interface Agenda1Controls {
  cancelable: boolean
  catalogsLoading: boolean
  create: string
  creatable: boolean
  empty: boolean
  filters: boolean
  mode: Agenda1Mode
  openable: boolean
  period: Agenda1Period
  reschedulable: boolean
  title: string
  withOwners: boolean
}

export const agenda1ControlArgs: Agenda1Controls = {
  cancelable: true,
  catalogsLoading: false,
  create: 'Novo compromisso',
  creatable: true,
  empty: false,
  filters: true,
  mode: 'calendar',
  openable: true,
  period: 'week',
  reschedulable: true,
  title: 'Agenda',
  withOwners: true,
}

export const agenda1ControlArgTypes: Partial<ArgTypes<Agenda1Controls>> = {
  cancelable: {
    control: 'boolean',
    description:
      'Passes `onCancel`; on, an open Compromisso shows Cancelar in the Lista and in the Tabela, which gains the Ações column.',
  },
  catalogsLoading: {
    control: 'boolean',
    description:
      'Passes `ownersLoading`; on, the Responsável filter shows skeleton rows.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  creatable: {
    control: 'boolean',
    description:
      'Passes `onCreate`; on, the toolbar shows Novo compromisso and a click on an empty slot of the Dia or Semana grid reports that slot.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no entries: the calendar shows the bare grid, the Lista and the Tabela the empty message.',
  },
  filters: {
    control: 'boolean',
    description:
      'Passes `onKindFilterChange`; on, Exibição lists the Tipo filter. The Responsável filter follows `owners`.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
    options: ['calendar', 'list', 'table'],
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpen`; on, a calendar item, a list title and a table row open the entry.',
  },
  period: {
    control: 'inline-radio',
    description:
      'The period of the window; Período in Exibição changes it too and calls `onPeriodChange`.',
    options: ['day', 'week', 'month'],
  },
  reschedulable: {
    control: 'boolean',
    description:
      'Passes `onReschedule`; on, Compromissos and Tarefas drag to another day or time and resize in the Dia and Semana grids.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`: the heading and the section name.',
  },
  withOwners: {
    control: 'boolean',
    description:
      'Passes `owners`; on, the Responsável column, the avatar of a list row and the Responsável filter appear.',
  },
}
