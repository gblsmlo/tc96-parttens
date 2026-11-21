import type { ArgTypes } from '@storybook/react-vite'

export interface CheckboxControls {
  checked: boolean
  description: string
  disabled: boolean
  indeterminate: boolean
  invalid: boolean
  label: string
}

export const checkboxControlArgs: CheckboxControls = {
  checked: false,
  description: '',
  disabled: false,
  indeterminate: false,
  invalid: false,
  label: 'Label text',
}

export const checkboxControlArgTypes: Partial<ArgTypes<CheckboxControls>> = {
  checked: {
    control: 'boolean',
    description: 'Starts the checkbox ticked, through `defaultChecked`.',
  },
  description: {
    control: 'text',
    description:
      'Text under the label, linked with `aria-describedby`; empty removes it.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Checkbox`.',
  },
  indeterminate: {
    control: 'boolean',
    description: 'The `indeterminate` of `Checkbox`: shows the mixed state.',
  },
  invalid: {
    control: 'boolean',
    description: 'Sets `aria-invalid` on `Checkbox`.',
  },
  label: {
    control: 'text',
    description: 'Text of the `Label` that names the checkbox.',
  },
}
