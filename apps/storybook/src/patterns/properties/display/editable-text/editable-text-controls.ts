import type { ArgTypes } from '@storybook/react-vite'
import type { EditableTextSize } from '@tc96/ui/patterns'

export const editableTextSizes = [
  'sm',
  'base',
  'lg',
  'xl',
] as const satisfies readonly EditableTextSize[]

export interface EditableTextControls {
  ariaLabel: string
  multiline: boolean
  placeholder: string
  readOnly: boolean
  size: EditableTextSize
  value: string
}

export const editableTextControlArgs: EditableTextControls = {
  ariaLabel: 'Título',
  multiline: false,
  placeholder: 'Sem título',
  readOnly: false,
  size: 'base',
  value: 'Conferir as assinaturas do contrato antes da reunião',
}

export const editableTextControlArgTypes: Partial<
  ArgTypes<EditableTextControls>
> = {
  ariaLabel: {
    control: 'text',
    description: 'The `ariaLabel` of `EditableText`: names the field.',
  },
  multiline: {
    control: 'boolean',
    description:
      'The `multiline` of `EditableText`: a `textarea` that wraps, where Enter adds a line.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `EditableText`, shown while the value is empty.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `EditableText`: renders the value as text, with no field.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `EditableText`: the text scale.',
    options: editableTextSizes,
  },
  value: {
    control: 'text',
    description:
      'The initial `value` of `EditableText`; empty passes `null`. A commit replaces it.',
  },
}
