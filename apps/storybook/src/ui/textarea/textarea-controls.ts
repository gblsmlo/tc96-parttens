import type { ArgTypes } from '@storybook/react-vite'
import {
  type TextareaSizeName,
  textareaSizeNames,
} from './textarea-variants.ts'

export interface TextareaControls {
  defaultValue: string
  disabled: boolean
  invalid: boolean
  label: string
  placeholder: string
  size: TextareaSizeName
  unstyled: boolean
}

export const textareaControlArgs: TextareaControls = {
  defaultValue: '',
  disabled: false,
  invalid: false,
  label: 'Message',
  placeholder: 'Type your message here',
  size: 'default',
  unstyled: false,
}

export const textareaControlArgTypes: Partial<ArgTypes<TextareaControls>> = {
  defaultValue: {
    control: 'text',
    description:
      'Starting text of the textarea, through `defaultValue`; more lines make it taller.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Textarea`.',
  },
  invalid: {
    control: 'boolean',
    description: 'Sets `aria-invalid` on `Textarea`.',
  },
  label: {
    control: 'text',
    description:
      'Accessible name, passed as `aria-label`; empty removes it, so name the textarea another way.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder` of `Textarea`; empty removes it.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `Textarea`.',
    options: textareaSizeNames,
  },
  unstyled: {
    control: 'boolean',
    description:
      'The `unstyled` of `Textarea`: drops the classes of the wrapper.',
  },
}
