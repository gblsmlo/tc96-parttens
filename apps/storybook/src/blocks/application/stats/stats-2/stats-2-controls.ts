import type { ArgTypes } from '@storybook/react-vite'

export interface Stats2Controls {
  limit: number
  quota: string
  title: string
  upgrade: string
  used: number
  withUpgrade: boolean
}

export const stats2ControlArgs: Stats2Controls = {
  limit: 1_000_000,
  quota: 'Uso da cota',
  title: 'Uso da API',
  upgrade: 'Fazer upgrade',
  used: 742_000,
  withUpgrade: true,
}

export const stats2ControlArgTypes: Partial<ArgTypes<Stats2Controls>> = {
  limit: {
    control: { min: 0, step: 10_000, type: 'number' },
    description: 'The `limit` prop, the top of the meter.',
  },
  quota: {
    control: 'text',
    description: 'Text of `labels.quota`, the name of the meter.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the card.',
  },
  upgrade: {
    control: 'text',
    description: 'Text of `labels.upgrade`, the button of `onUpgrade`.',
  },
  used: {
    control: { min: 0, step: 10_000, type: 'number' },
    description: 'The `used` prop; above `limit` the meter stays full.',
  },
  withUpgrade: {
    control: 'boolean',
    description: 'Passes `onUpgrade`; off removes the Upgrade button.',
  },
}
