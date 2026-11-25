import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties-labels.ts'

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
  allowEmpty: boolean
  ariaLabel: string
  disabled: boolean
  grouped: boolean
  icons: boolean
  labelsEmptyOption: string
  labelsFallback: string
  placeholder: string
  readOnly: boolean
  value: SelectValueControl
  variant: PropertyVariant
}

export const selectControlArgs: SelectControls = {
  allowEmpty: false,
  ariaLabel: 'Tipo',
  disabled: false,
  grouped: false,
  icons: true,
  labelsEmptyOption: ptBRPropertyLabels.select.emptyOption,
  labelsFallback: ptBRPropertyLabels.select.fallback,
  placeholder: 'Tipo',
  readOnly: false,
  value: 'meeting',
  variant: 'badge',
}

export const selectControlArgTypes: Partial<ArgTypes<SelectControls>> = {
  allowEmpty: {
    control: 'boolean',
    description:
      'The `allowEmpty` of `SelectProperty`: an option at the top of the list that reports `null`.',
  },
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `SelectProperty`, prefixed to the label of the value in the accessible name.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `SelectProperty`.',
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
  labelsEmptyOption: {
    control: 'text',
    description:
      '`labels.emptyOption` of `SelectProperty`: the label of the empty option that `allowEmpty` adds.',
  },
  labelsFallback: {
    control: 'text',
    description:
      '`labels.fallback` of `SelectProperty`: the text of a value no option declares (`unknown`).',
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
      'The `value` of `SelectProperty`; `none` passes `null` and `unknown` a value no option declares.',
    options: selectValues,
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `SelectProperty`.',
    options: selectVariants,
  },
}
