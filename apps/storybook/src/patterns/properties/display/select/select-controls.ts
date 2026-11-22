import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/parttens'

export const selectValues = [
  'meeting',
  'call',
  'email',
  'other',
  'none',
  'unknown',
] as const

export type SelectValueControl = (typeof selectValues)[number]

export const selectVariants = ['badge', 'plain'] as const

export interface SelectControls {
  ariaLabel: string
  disabled: boolean
  emptyOptionLabel: string
  fallback: string
  grouped: boolean
  icons: boolean
  placeholder: string
  readOnly: boolean
  value: SelectValueControl
  variant: PropertyVariant
}

export const selectControlArgs: SelectControls = {
  ariaLabel: 'Tipo',
  disabled: false,
  emptyOptionLabel: '',
  fallback: '—',
  grouped: false,
  icons: true,
  placeholder: 'Tipo',
  readOnly: false,
  value: 'meeting',
  variant: 'badge',
}

export const selectControlArgTypes: Partial<ArgTypes<SelectControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `SelectProperty`, prefixed to the label of the value in the accessible name.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `SelectProperty`.',
  },
  emptyOptionLabel: {
    control: 'text',
    description:
      'The `emptyOptionLabel` of `SelectProperty`: an option at the top of the list that reports `null`; empty leaves it out.',
  },
  fallback: {
    control: 'text',
    description:
      'The `fallback` of `SelectProperty`, shown for a value no option declares (`unknown`).',
  },
  grouped: {
    control: 'boolean',
    description:
      'Passes the options as `groups` (Presencial, Remoto, Outros) instead of a flat `options` list.',
  },
  icons: {
    control: 'boolean',
    description: 'Gives each option an `icon` and a `tone`.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `SelectProperty`, shown while the value is `null` (`none`).',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `SelectProperty`: the same look, with no list to open.',
  },
  value: {
    control: 'select',
    description:
      'The `value` of `SelectProperty`; `none` passes `null` and `unknown` a value no option declares. The story keeps the pick in its own state until this control changes.',
    options: selectValues,
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `SelectProperty`.',
    options: selectVariants,
  },
}
