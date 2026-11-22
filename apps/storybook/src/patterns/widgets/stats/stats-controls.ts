import type { ArgTypes } from '@storybook/react-vite'

export const statsFormatNames = [
  'currency',
  'wholeCurrency',
  'decimal',
  'percent',
] as const

export type StatsFormatName = (typeof statsFormatNames)[number]

export interface StatsControls {
  change: number
  changeLabel: string
  format: StatsFormatName
  icon: boolean
  label: string
  sparkline: boolean
  tone: 'default' | 'inverted'
  trend: boolean
  value: number
}

export const statsControlArgs: StatsControls = {
  change: 0.201,
  changeLabel: 'from last month',
  format: 'currency',
  icon: false,
  label: 'Total revenue',
  sparkline: false,
  tone: 'default',
  trend: true,
  value: 45231.89,
}

export const statsControlArgTypes: Partial<ArgTypes<StatsControls>> = {
  change: {
    control: { step: 0.001, type: 'number' },
    description:
      'The `change` of `MetricWidget`, as a ratio (`0.201` reads 20.10%). A negative ratio reads as a fall and `0` as no change.',
  },
  changeLabel: {
    control: 'text',
    description:
      'The `changeLabel` of `MetricWidget`, shown after the trend. Empty removes it.',
  },
  format: {
    control: 'select',
    description:
      'Picks the `format` of `MetricWidget` from named presets: `currency` (the default), `wholeCurrency` (no cents), `decimal` and `percent` (the value is a ratio).',
    options: statsFormatNames,
  },
  icon: {
    control: 'boolean',
    description: 'Adds an `IconFrame` to the `icon` slot of the header.',
  },
  label: {
    control: 'text',
    description:
      'The `label` of `MetricWidget`, which names the card as a region.',
  },
  sparkline: {
    control: 'boolean',
    description: 'Adds a sparkline of twelve weeks as the `children`.',
  },
  tone: {
    control: 'inline-radio',
    description: 'The `tone` of `MetricWidget`.',
    options: ['default', 'inverted'],
  },
  trend: {
    control: 'boolean',
    description: 'Passes `change` to `MetricWidget`, which adds the trend.',
  },
  value: {
    control: 'number',
    description: 'The `value` of `MetricWidget`.',
  },
}
