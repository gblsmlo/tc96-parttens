import type { ArgTypes } from '@storybook/react-vite'
import type { FormPrimitive } from '@tc96/ui/form'
import { fn } from 'storybook/test'

export const formValidationModes = ['onSubmit', 'onBlur', 'onChange'] as const

export type FormValidationModeName = (typeof formValidationModes)[number]

export interface FormControls {
  description: string
  error: string
  errors: string
  label: string
  onFormSubmit: (
    values: Record<string, unknown>,
    details: FormPrimitive.SubmitEventDetails,
  ) => void
  submitLabel: string
  validationMode: FormValidationModeName
}

export const formControlArgs: FormControls = {
  description: 'We send the receipt to this address.',
  error: 'Enter a valid email address.',
  errors: '',
  label: 'Email',
  onFormSubmit: fn(),
  submitLabel: 'Submit',
  validationMode: 'onSubmit',
}

export const formControlArgTypes: Partial<ArgTypes<FormControls>> = {
  description: {
    control: 'text',
    description: 'Text of the `FieldDescription`; empty removes the part.',
  },
  error: {
    control: 'text',
    description:
      'Text of the `FieldError` when the email is missing or invalid; unused while `errors` has a message.',
  },
  errors: {
    control: 'text',
    description:
      'Message passed in `errors` for the `email` field; empty passes no `errors`.',
  },
  label: {
    control: 'text',
    description: 'Text of the `FieldLabel` of the email field.',
  },
  onFormSubmit: {
    control: false,
    description:
      'The `onFormSubmit` of `Form`, called with the values of a valid submit.',
  },
  submitLabel: {
    control: 'text',
    description: 'Label of the submit `Button`.',
  },
  validationMode: {
    control: 'select',
    description: 'The `validationMode` of `Form`.',
    options: formValidationModes,
  },
}
