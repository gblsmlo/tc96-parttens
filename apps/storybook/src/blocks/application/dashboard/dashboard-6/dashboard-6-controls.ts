import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard6Controls {
  empty: boolean
  error: boolean
  pending: boolean
  periodSelect: boolean
  title: string
}

export const dashboard6ControlArgs: Dashboard6Controls = {
  empty: false,
  error: false,
  pending: false,
  periodSelect: true,
  title: 'Analítico',
}

export const dashboard6ControlArgTypes: Partial<ArgTypes<Dashboard6Controls>> =
  {
    empty: {
      control: 'boolean',
      description: 'Passes no `summary` and empty `stages` and `lossReasons`.',
    },
    error: {
      control: 'boolean',
      description: 'The `error` prop: renders the error surface.',
    },
    pending: {
      control: 'boolean',
      description: 'The `pending` prop: renders the skeleton.',
    },
    periodSelect: {
      control: 'boolean',
      description:
        'Passes `period`, `periodOptions` and `onPeriodChange`; off, the header shows no period select.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the dashboard.',
    },
  }
