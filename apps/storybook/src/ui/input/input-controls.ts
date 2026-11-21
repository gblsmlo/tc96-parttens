import type { ArgTypes } from '@storybook/react-vite'
import {
  type InputSizeName,
  type InputTypeName,
  inputSizeNames,
  inputTypeNames,
} from './input-variants.ts'

export interface InputControls {
  defaultValue: string
  disabled: boolean
  invalid: boolean
  label: string
  placeholder: string
  size: InputSizeName
  type: InputTypeName
  unstyled: boolean
}

export const inputControlArgs: InputControls = {
  defaultValue: '',
  disabled: false,
  invalid: false,
  label: 'Enter text',
  placeholder: 'Enter text',
  size: 'default',
  type: 'text',
  unstyled: false,
}

export const inputControlArgTypes: Partial<ArgTypes<InputControls>> = {
  defaultValue: {
    control: 'text',
    description: 'Starting value of the input, through `defaultValue`.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Input`.',
  },
  invalid: {
    control: 'boolean',
    description: 'Sets `aria-invalid` on `Input`.',
  },
  label: {
    control: 'text',
    description:
      'Accessible name, passed as `aria-label`; empty removes it, so name the input another way.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder` of `Input`; empty removes it.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `Input`.',
    options: inputSizeNames,
  },
  type: {
    control: 'select',
    description: 'The `type` of `Input`.',
    options: inputTypeNames,
  },
  unstyled: {
    control: 'boolean',
    description: 'The `unstyled` of `Input`: drops the classes of the wrapper.',
  },
}
