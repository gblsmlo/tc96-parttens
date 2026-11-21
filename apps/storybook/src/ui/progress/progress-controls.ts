import type { ArgTypes } from '@storybook/react-vite'

export interface ProgressControls {
  indeterminate: boolean
  label: string
  max: number
  showLabel: boolean
  showValue: boolean
  value: number
}

export const progressControlArgs: ProgressControls = {
  indeterminate: false,
  label: 'Label text',
  max: 100,
  showLabel: true,
  showValue: true,
  value: 40,
}

export const progressControlArgTypes: Partial<ArgTypes<ProgressControls>> = {
  indeterminate: {
    control: 'boolean',
    description:
      'Passes `value={null}`: the progress is unknown, and `value` stops acting.',
  },
  label: {
    control: 'text',
    description:
      'Names the bar: the text of `ProgressLabel`, or its `aria-label` when `showLabel` is off.',
  },
  max: {
    control: { type: 'number', min: 1 },
    description: 'The `max` of `Progress`; `min` stays `0`.',
  },
  showLabel: {
    control: 'boolean',
    description:
      'Adds a `ProgressLabel` with `label`; off names the bar with `aria-label`.',
  },
  showValue: {
    control: 'boolean',
    description: 'Adds a `ProgressValue` with the formatted value.',
  },
  value: {
    control: { type: 'number', min: 0 },
    description: 'The `value` of `Progress`, clamped between `0` and `max`.',
  },
}
