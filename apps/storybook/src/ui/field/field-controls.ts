import type { ArgTypes } from '@storybook/react-vite'

export interface FieldControls {
  description: string
  disabled: boolean
  error: string
  invalid: boolean
  label: string
  placeholder: string
  required: boolean
}

export const fieldControlArgs: FieldControls = {
  description: 'Visible on your profile.',
  disabled: false,
  error: 'Please enter your name.',
  invalid: false,
  label: 'Name',
  placeholder: 'Enter your name',
  required: false,
}

export const fieldControlArgTypes: Partial<ArgTypes<FieldControls>> = {
  description: {
    control: 'text',
    description: 'Text of `FieldDescription`; empty removes the part.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Field`.',
  },
  error: {
    control: 'text',
    description:
      'Text of `FieldError`, shown while the field is invalid; empty removes the part.',
  },
  invalid: {
    control: 'boolean',
    description: 'The `invalid` of `Field`, with `match` on `FieldError`.',
  },
  label: {
    control: 'text',
    description: 'Text of `FieldLabel`; empty removes the part.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder` of the `Input`.',
  },
  required: {
    control: 'boolean',
    description:
      'Sets `required` on the `Input` and adds a hidden asterisk to the label.',
  },
}
