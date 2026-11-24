import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard1Controls {
  deltas: boolean
  empty: boolean
  error: boolean
  pending: boolean
  title: string
}

export const dashboard1ControlArgs: Dashboard1Controls = {
  deltas: true,
  empty: false,
  error: false,
  pending: false,
  title: 'Exceções de expedição',
}

export const dashboard1ControlArgTypes: Partial<ArgTypes<Dashboard1Controls>> =
  {
    deltas: {
      control: 'boolean',
      description: 'Keeps or drops the `delta` of every KPI.',
    },
    empty: {
      control: 'boolean',
      description: 'Passes `kpis`, `capacity` and `exceptions` empty.',
    },
    error: {
      control: 'boolean',
      description: 'The `error` prop: renders the error surface.',
    },
    pending: {
      control: 'boolean',
      description: 'The `pending` prop: renders the skeleton.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the dashboard.',
    },
  }
