import type { ArgTypes } from '@storybook/react-vite'

export interface Card4Controls {
  empty: boolean
  maxAttendees: number
  title: string
  withJoin: boolean
}

export const card4ControlArgs: Card4Controls = {
  empty: false,
  maxAttendees: 4,
  title: 'Agenda de reuniões',
  withJoin: true,
}

export const card4ControlArgTypes: Partial<ArgTypes<Card4Controls>> = {
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `meetings` list, which shows the empty state.',
  },
  maxAttendees: {
    control: { max: 6, min: 1, step: 1, type: 'number' },
    description: 'The `maxAttendees` shown before the `+n` counter.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the list.',
  },
  withJoin: {
    control: 'boolean',
    description: 'Passes `onJoin`, which shows the join button on each card.',
  },
}
