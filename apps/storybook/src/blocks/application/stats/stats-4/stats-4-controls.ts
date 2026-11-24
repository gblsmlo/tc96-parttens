import type { ArgTypes } from '@storybook/react-vite'
import type { Stats4Range } from '@tc96/ui/blocks/application/stats/stats-4'

export interface Stats4Controls {
  empty: boolean
  goal: number
  range: Stats4Range
  title: string
  total: number
}

export const stats4ControlArgs: Stats4Controls = {
  empty: false,
  goal: 1500,
  range: '30d',
  title: 'Visão geral de leads',
  total: 1200,
}

export const stats4ControlArgTypes: Partial<ArgTypes<Stats4Controls>> = {
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `sources` list, which leaves the stacked bar and the legend empty.',
  },
  goal: {
    control: { min: 0, step: 100, type: 'number' },
    description: 'The `goal` the progress bar measures `total` against.',
  },
  range: {
    control: 'inline-radio',
    description:
      'Initial `range`; the story keeps it in state, as a consumer does.',
    options: ['7d', '30d', '90d'],
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the card.',
  },
  total: {
    control: { min: 0, step: 100, type: 'number' },
    description: 'The headline `total` of leads.',
  },
}
