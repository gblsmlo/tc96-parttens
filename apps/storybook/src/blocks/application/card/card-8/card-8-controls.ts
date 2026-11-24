import type { ArgTypes } from '@storybook/react-vite'

export interface Card8Controls {
  empty: boolean
  heading: string
  withActions: boolean
  withJoin: boolean
}

export const card8ControlArgs: Card8Controls = {
  empty: false,
  heading: 'Reunião',
  withActions: true,
  withJoin: true,
}

export const card8ControlArgTypes: Partial<ArgTypes<Card8Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes an empty `meetings` list.',
  },
  heading: { control: 'text', description: 'Text of `labels.heading`.' },
  withActions: {
    control: 'boolean',
    description: 'Passes `actions` and `onActionSelect`, which show the menu.',
  },
  withJoin: {
    control: 'boolean',
    description: 'Passes `onJoin`, which shows the join button.',
  },
}
