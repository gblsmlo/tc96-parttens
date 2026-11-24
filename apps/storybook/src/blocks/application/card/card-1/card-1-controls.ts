import type { ArgTypes } from '@storybook/react-vite'

export interface Card1Controls {
  accents: boolean
  title: string
}

export const card1ControlArgs: Card1Controls = {
  accents: true,
  title: 'Detalhes',
}

export const card1ControlArgTypes: Partial<ArgTypes<Card1Controls>> = {
  accents: {
    control: 'boolean',
    description:
      'Whether each fact carries its `accent`: badge, avatar group or icon.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the card.',
  },
}
