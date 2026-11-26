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
    description: 'Passes `ownersLoading` for the owner catalog.',
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
      'Passes `onKindFilterChange`; on, the Tipo filter is controllable. The Responsável filter follows `owners`. The toolbar has no Exibição menu for them.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; changing it calls `onModeChange`. The toolbar has no Exibição menu for the mode tabs.',
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
      'The period of the window; the Dia, Semana and Mês toggle in the toolbar changes it and calls `onPeriodChange`.',
    options: ['day', 'week', 'month'],
  },
  reschedulable: {
    control: 'boolean',
    description:
      'Passes `onReschedule`; on, Compromissos and Tarefas drag to another day or time and resize in the Dia and Semana grids.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`: the section name.',
  },
  withOwners: {
    control: 'boolean',
    description:
      'Passes `owners`; on, the Responsável column and the avatar of a list row appear.',
  },
}
