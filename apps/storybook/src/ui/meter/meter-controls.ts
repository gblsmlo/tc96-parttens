import type { ArgTypes } from '@storybook/react-vite'

export interface MeterControls {
  label: string
  max: number
  min: number
  showLabel: boolean
  showValue: boolean
  value: number
}

export const meterControlArgs: MeterControls = {
  label: 'Label text',
  max: 100,
  min: 0,
  showLabel: true,
  showValue: true,
  value: 60,
}

export const meterControlArgTypes: Partial<ArgTypes<MeterControls>> = {
  label: {
    control: 'text',
    description:
      'Names the meter: the text of `MeterLabel`, or its `aria-label` when `showLabel` is off.',
  },
  max: {
    control: { type: 'range', min: 60, max: 200, step: 5 },
    description:
      'The `max` of `Meter`, from `60` to `200`, so it always stays above `min`.',
  },
  min: {
    control: { type: 'range', min: 0, max: 50, step: 5 },
    description:
      'The `min` of `Meter`, from `0` to `50`, so it always stays below `max`.',
  },
  showLabel: {
    control: 'boolean',
    description:
      'Adds a `MeterLabel` with `label`; off names the meter with `aria-label`.',
  },
  showValue: {
    control: 'boolean',
    description:
      'Adds a `MeterValue` with the formatted value, the share of the range as a percentage.',
  },
  value: {
    control: { type: 'range', min: 0, max: 200, step: 1 },
    description:
      'The `value` of `Meter`, from `0` to `200`; the meter clamps it between `min` and `max`.',
  },
}
