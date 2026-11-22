import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/parttens'

export const textEditings = ['none', 'trigger', 'inline'] as const

export type TextEditingControl = (typeof textEditings)[number]

export const textTrailingVisibilities = ['always', 'hover'] as const

export type TextTrailingVisibility = (typeof textTrailingVisibilities)[number]

export const textVariants = ['badge', 'plain'] as const

export interface TextControls {
  ariaLabel: string
  copyLabel: string
  disabled: boolean
  editing: TextEditingControl
  fallback: string
  icon: boolean
  inputPlaceholder: string
  trailingVisibility: TextTrailingVisibility
  value: string
  variant: PropertyVariant
}

export const textControlArgs: TextControls = {
  ariaLabel: 'Tipo',
  copyLabel: '',
  disabled: false,
  editing: 'none',
  fallback: 'Não informado',
  icon: true,
  inputPlaceholder: '',
  trailingVisibility: 'always',
  value: 'Solicitação de documento',
  variant: 'badge',
}

export const textControlArgTypes: Partial<ArgTypes<TextControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `TextProperty`, prefixed to the value in the accessible name, and the name of the field.',
  },
  copyLabel: {
    control: 'text',
    description:
      'The `copyLabel` of `TextProperty`: names a copy button after the value; empty leaves it out.',
  },
  disabled: {
    control: 'boolean',
    description:
      'The `disabled` of `TextProperty`: the value shows read-only even with `editing`.',
  },
  editing: {
    control: 'inline-radio',
    description:
      '`none` passes no `onCommit`; `trigger` and `inline` pass one with that `editing`. The story keeps the commit in its own state until `value` changes.',
    options: textEditings,
  },
  fallback: {
    control: 'text',
    description:
      'The `fallback` of `TextProperty`, shown while `value` is empty.',
  },
  icon: {
    control: 'boolean',
    description: 'Passes an `icon` before the value.',
  },
  inputPlaceholder: {
    control: 'text',
    description:
      'The `inputPlaceholder` of `TextProperty`: the placeholder of the field; empty falls back to `fallback`.',
  },
  trailingVisibility: {
    control: 'inline-radio',
    description:
      'The `trailingVisibility` of `TextProperty`; acts only with `copyLabel`.',
    options: textTrailingVisibilities,
  },
  value: {
    control: 'text',
    description: 'The `value` of `TextProperty`; empty passes `null`.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `TextProperty`.',
    options: textVariants,
  },
}
