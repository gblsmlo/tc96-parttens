import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard5Controls {
  empty: boolean
  error: boolean
  ownerView: boolean
  panelLinks: boolean
  pending: boolean
  title: string
}

export const dashboard5ControlArgs: Dashboard5Controls = {
  empty: false,
  error: false,
  ownerView: true,
  panelLinks: true,
  pending: false,
  title: 'Pendências',
}

export const dashboard5ControlArgTypes: Partial<ArgTypes<Dashboard5Controls>> =
  {
    empty: {
      control: 'boolean',
      description:
        'Passes `metrics` empty and every list, `queues` and `dueDays` empty.',
    },
    error: {
      control: 'boolean',
      description: 'The `error` prop: renders the error surface.',
    },
    ownerView: {
      control: 'boolean',
      description:
        'Passes `metrics.publications`, `metrics.capture` and `publications`; off, the two owner cards and the publications panel are not rendered.',
    },
    panelLinks: {
      control: 'boolean',
      description:
        'Passes `links`; off, the panels show no Abrir Prazos, Abrir fila or Abrir Agenda link.',
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
