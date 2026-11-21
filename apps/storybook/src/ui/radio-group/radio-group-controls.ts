import type { ArgTypes } from '@storybook/react-vite'
import {
  type SelectionValue,
  selectionLabels,
  selectionValues,
} from './radio-group-variants.ts'

export interface RadioGroupControls {
  defaultValue: SelectionValue
  description: boolean
  disabled: boolean
  disabledItem: boolean
  invalid: boolean
  label: string
}

export const radioGroupControlArgs: RadioGroupControls = {
  defaultValue: 'next',
  description: false,
  disabled: false,
  disabledItem: false,
  invalid: false,
  label: 'Framework',
}

export const radioGroupControlArgTypes: Partial<ArgTypes<RadioGroupControls>> =
  {
    defaultValue: {
      control: { labels: selectionLabels, type: 'select' },
      description:
        'The `defaultValue` of `RadioGroup`: the radio selected on mount; `None` selects nothing.',
      options: selectionValues,
    },
    description: {
      control: 'boolean',
      description:
        'Adds a description under each option, linked to its radio with `aria-describedby`.',
    },
    disabled: {
      control: 'boolean',
      description: 'The `disabled` of `RadioGroup`.',
    },
    disabledItem: {
      control: 'boolean',
      description: 'Disables the `Vite` radio alone.',
    },
    invalid: {
      control: 'boolean',
      description: 'Sets `aria-invalid` on every `Radio`.',
    },
    label: {
      control: 'text',
      description:
        'Text of the caption that names the group through `aria-labelledby`; empty removes the caption.',
    },
  }
