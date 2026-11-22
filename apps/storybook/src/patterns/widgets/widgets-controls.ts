import type { ArgTypes } from '@storybook/react-vite'

export type WidgetsTrendVariant = 'badge' | 'plain'

export interface WidgetsControls {
  amount: boolean
  change: number
  dimFraction: boolean
  expanded: boolean
  list: boolean
  periods: boolean
  title: string
  trend: boolean
  trendVariant: WidgetsTrendVariant
  value: number
  visibleCount: number
}

export const widgetsControlArgs: WidgetsControls = {
  amount: true,
  change: 0.124,
  dimFraction: false,
  expanded: false,
  list: true,
  periods: false,
  title: 'Monthly revenue',
  trend: true,
  trendVariant: 'badge',
  value: 48250.75,
  visibleCount: 5,
}

export const widgetsControlArgTypes: Partial<ArgTypes<WidgetsControls>> = {
  amount: {
    control: 'boolean',
    description: 'Adds the `Amount` with the value of the card.',
  },
  change: {
    control: { step: 0.001, type: 'number' },
    description:
      'The `value` of the `TrendIndicator`, as a ratio (`0.124` reads 12.40%). A negative ratio reads as a fall and `0` as no change.',
  },
  dimFraction: {
    control: 'boolean',
    description: 'The `dimFraction` of the `Amount`: dims the cents.',
  },
  expanded: {
    control: 'boolean',
    description:
      'Starts the `ExpandableList` expanded (`defaultExpanded`). It needs more items than `visibleCount` to show.',
  },
  list: {
    control: 'boolean',
    description:
      'Adds an `ExpandableList` of eight orders, collapsed after `visibleCount`.',
  },
  periods: {
    control: 'boolean',
    description:
      'Adds a `WidgetPeriodToggle` to the header. The card keeps the period in its own state and the quarter shows three times the value.',
  },
  title: {
    control: 'text',
    description:
      'Text of the card title, which names the card as a region. Empty removes the title.',
  },
  trend: {
    control: 'boolean',
    description: 'Adds a `TrendIndicator` beside the amount.',
  },
  trendVariant: {
    control: 'inline-radio',
    description:
      'The `variant` of the `TrendIndicator`: `badge` fills it, `plain` is colored text.',
    options: ['badge', 'plain'],
  },
  value: {
    control: 'number',
    description: 'The `value` of the `Amount`, in US dollars.',
  },
  visibleCount: {
    control: { max: 8, min: 1, type: 'number' },
    description:
      'The `visibleCount` of the `ExpandableList`: how many orders show before the rest folds.',
  },
}
