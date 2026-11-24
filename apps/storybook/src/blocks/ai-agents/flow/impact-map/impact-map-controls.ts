import type { ArgTypes } from '@storybook/react-vite'

export interface ImpactMapControls {
  empty: boolean
  error: boolean
  owners: boolean
  pending: boolean
  selectedId: string
  title: string
  values: boolean
}

export const impactMapControlArgs: ImpactMapControls = {
  empty: false,
  error: false,
  owners: true,
  pending: false,
  selectedId: 'onboarding',
  title: 'Mapa de impacto de crescimento',
  values: true,
}

export const impactMapControlArgTypes: Partial<ArgTypes<ImpactMapControls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes `nodes` empty, which renders the empty state.',
  },
  error: {
    control: 'boolean',
    description: 'The `error` prop: renders the error surface.',
  },
  owners: {
    control: 'boolean',
    description: 'Keeps or drops the `owner` of every node.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop: renders the skeleton.',
  },
  selectedId: {
    control: 'select',
    description:
      'The `selectedId` prop: the highlighted node. `none` leaves no node selected.',
    options: [
      'none',
      'mrr',
      'activation',
      'retention',
      'onboarding',
      'checklist',
      'churn',
      'referral',
    ],
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the map.',
  },
  values: {
    control: 'boolean',
    description: 'Keeps or drops the `valueText` of every node.',
  },
}
