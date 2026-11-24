import type { ArgTypes } from '@storybook/react-vite'

export interface Card7Controls {
  action: string
  withAction: boolean
  withItems: boolean
  withStats: boolean
  withStatus: boolean
}

export const card7ControlArgs: Card7Controls = {
  action: 'Enviar proposta',
  withAction: true,
  withItems: true,
  withStats: true,
  withStatus: true,
}

export const card7ControlArgTypes: Partial<ArgTypes<Card7Controls>> = {
  action: {
    control: 'text',
    description: 'Text of `labels.action`, the action button.',
  },
  withAction: {
    control: 'boolean',
    description: 'Passes `onAction`, which shows the action button.',
  },
  withItems: {
    control: 'boolean',
    description: 'Passes `items`, the list of amounts.',
  },
  withStats: {
    control: 'boolean',
    description: 'Passes `stats`, the summary strip.',
  },
  withStatus: {
    control: 'boolean',
    description: 'Passes `contact.status`, the badge under the name.',
  },
}
