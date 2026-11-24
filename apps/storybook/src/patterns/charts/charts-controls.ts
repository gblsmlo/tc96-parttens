import type { ArgTypes } from '@storybook/react-vite'

export interface ChartsControls {
  ariaLabel: string
  colorLabel: string
  formattedTooltip: boolean
  height: number
  maxRadius: number
  minRadius: number
  xLabel: string
  yLabel: string
}

export const chartsControlArgs: ChartsControls = {
  ariaLabel: 'Account retention by monthly revenue',
  colorLabel: 'Segment',
  formattedTooltip: true,
  height: 360,
  maxRadius: 22,
  minRadius: 4,
  xLabel: 'Monthly revenue',
  yLabel: 'Retention',
}

export const chartsControlArgTypes: Partial<ArgTypes<ChartsControls>> = {
  ariaLabel: {
    control: 'text',
    description: 'The `ariaLabel` of `ScatterChart`, which names the chart.',
  },
  colorLabel: {
    control: 'text',
    description: 'The `colorLabel` of `ScatterChart`, the legend title.',
  },
  formattedTooltip: {
    control: 'boolean',
    description:
      'Passes `formatTooltip` with one sentence per account. Off shows the default tooltip with the channel values.',
  },
  height: {
    control: { min: 200, step: 20, type: 'number' },
    description: 'The `height` of `ScatterChart`, in pixels.',
  },
  maxRadius: {
    control: { min: 1, type: 'number' },
    description:
      'The second value of `radiusRange`: the radius of the largest `size`.',
  },
  minRadius: {
    control: { min: 1, type: 'number' },
    description:
      'The first value of `radiusRange`: the radius of the smallest `size`.',
  },
  xLabel: {
    control: 'text',
    description: 'The `xLabel` of `ScatterChart`, the x axis title.',
  },
  yLabel: {
    control: 'text',
    description: 'The `yLabel` of `ScatterChart`, the y axis title.',
  },
}
