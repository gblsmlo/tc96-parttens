import type { ArgTypes } from '@storybook/react-vite'

export interface FieldsetControls {
  disabled: boolean
  legend: string
}

export const fieldsetControlArgs: FieldsetControls = {
  disabled: false,
  legend: 'Billing details',
}

export const fieldsetControlArgTypes: Partial<ArgTypes<FieldsetControls>> = {
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Fieldset`.',
  },
  legend: {
    control: 'text',
    description: 'Text of `FieldsetLegend`; empty removes the part.',
  },
}
