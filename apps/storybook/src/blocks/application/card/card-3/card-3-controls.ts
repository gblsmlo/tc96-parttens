import type { ArgTypes } from '@storybook/react-vite'

export interface Card3Controls {
  follow: boolean
  message: boolean
}

export const card3ControlArgs: Card3Controls = {
  follow: true,
  message: true,
}

export const card3ControlArgTypes: Partial<ArgTypes<Card3Controls>> = {
  follow: {
    control: 'boolean',
    description:
      'Whether `onFollow` is passed; without it the Seguir button does not render.',
  },
  message: {
    control: 'boolean',
    description:
      'Whether `onMessage` is passed; without it the Mensagem button does not render.',
  },
}
