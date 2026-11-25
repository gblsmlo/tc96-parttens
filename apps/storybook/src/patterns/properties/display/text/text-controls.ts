import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties-labels.ts'

export const textEditings = ['none', 'trigger', 'inline'] as const

export type TextEditingControl = (typeof textEditings)[number]

export const textTrailingVisibilities = ['always', 'hover'] as const

export type TextTrailingVisibility = (typeof textTrailingVisibilities)[number]

export const textVariants = ['badge', 'plain'] as const

export interface TextControls {
  ariaLabel: string
  copyable: boolean
  disabled: boolean
  editing: TextEditingControl
  icon: boolean
  labelsAdd: string
  labelsCopy: string
  labelsFallback: string
  labelsInputPlaceholder: string
  trailingVisibility: TextTrailingVisibility
  value: string
  variant: PropertyVariant
}

export const textControlArgs: TextControls = {
  ariaLabel: 'Tipo',
  copyable: false,
  disabled: false,
  editing: 'none',
  icon: true,
  labelsAdd: '',
  labelsCopy: ptBRPropertyLabels.text.copy,
  labelsFallback: ptBRPropertyLabels.text.fallback,
  labelsInputPlaceholder: '',
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
  copyable: {
    control: 'boolean',
    description:
      'The `copyable` of `TextProperty`: a copy button after the value, named by `labels.copy`.',
  },
  disabled: {
    control: 'boolean',
    description:
      'The `disabled` of `TextProperty`: the value shows read-only even with `editing`.',
  },
  editing: {
    control: 'inline-radio',
    description:
      '`none` passes no `onCommit`; `trigger` and `inline` pass one with that `editing`, kept in the story state until `value` changes.',
    options: textEditings,
  },
  icon: {
    control: 'boolean',
    description: 'Passes an `icon` before the value.',
  },
  labelsAdd: {
    control: 'text',
    description:
      '`labels.add` of `TextProperty`: the name of the add button; empty falls back to `labels.fallback`.',
  },
  labelsCopy: {
    control: 'text',
    description:
      '`labels.copy` of `TextProperty`: the name of the copy button; acts only with `copyable`.',
  },
  labelsFallback: {
    control: 'text',
    description:
      '`labels.fallback` of `TextProperty`: the text while `value` is empty.',
  },
  labelsInputPlaceholder: {
    control: 'text',
    description:
      '`labels.inputPlaceholder` of `TextProperty`: the placeholder of the field; empty falls back to `labels.fallback`.',
  },
  trailingVisibility: {
    control: 'inline-radio',
    description:
      'The `trailingVisibility` of `TextProperty`; acts only with `copyable`.',
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
