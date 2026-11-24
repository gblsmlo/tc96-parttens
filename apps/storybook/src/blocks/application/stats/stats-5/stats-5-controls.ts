import type { ArgTypes } from '@storybook/react-vite'

export interface Stats5Controls {
  churnTrend: number
  currency: 'BRL' | 'USD'
  revenueTrend: number
  title: string
}

export const stats5ControlArgs: Stats5Controls = {
  churnTrend: -0.031,
  currency: 'BRL',
  revenueTrend: 0.082,
  title: 'Vendas e cancelamentos',
}

export const stats5ControlArgTypes: Partial<ArgTypes<Stats5Controls>> = {
  churnTrend: {
    control: { max: 0.5, min: -0.5, step: 0.01, type: 'number' },
    description:
      'Trend of the churn item as a ratio; `lowerIsBetter` makes a drop green.',
  },
  currency: {
    control: 'inline-radio',
    description: 'The `currency` prop, used by the currency item.',
    options: ['BRL', 'USD'],
  },
  revenueTrend: {
    control: { max: 0.5, min: -0.5, step: 0.01, type: 'number' },
    description: 'Trend of the revenue item as a ratio (`0.082` is 8,20%).',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the card.',
  },
}
