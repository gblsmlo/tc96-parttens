import type { ArgTypes } from '@storybook/react-vite'

export interface Stats3Controls {
  segments: number
  title: string
}

export const stats3ControlArgs: Stats3Controls = {
  segments: 10,
  title: 'Capacidade',
}

export const stats3ControlArgTypes: Partial<ArgTypes<Stats3Controls>> = {
  segments: {
    control: { max: 20, min: 4, step: 1, type: 'number' },
    description: 'The `segments` prop, how many bars each meter has.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the card.',
  },
}
