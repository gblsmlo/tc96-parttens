import type { ArgTypes } from '@storybook/react-vite'
import type { Stats6Period } from '@tc96/ui/blocks/application/stats/stats-6'

export interface Stats6Controls {
  currency: 'BRL' | 'USD'
  delta: number
  period: Stats6Period
  title: string
}

export const stats6ControlArgs: Stats6Controls = {
  currency: 'BRL',
  delta: 0.021,
  period: 'month',
  title: 'Alocação da carteira',
}

export const stats6ControlArgTypes: Partial<ArgTypes<Stats6Controls>> = {
  currency: {
    control: 'inline-radio',
    description: 'The `currency` prop of the amounts.',
    options: ['BRL', 'USD'],
  },
  delta: {
    control: { max: 0.5, min: -0.5, step: 0.01, type: 'number' },
    description: 'Delta of the first sleeve as a ratio (`0.021` is 2,10%).',
  },
  period: {
    control: 'inline-radio',
    description:
      'Initial `period`; the story keeps it in state, as a consumer does.',
    options: ['day', 'week', 'month', 'year'],
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the card.',
  },
}
