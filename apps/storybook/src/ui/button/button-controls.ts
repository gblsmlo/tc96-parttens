import type { ArgTypes } from '@storybook/react-vite'
import {
  type ButtonSizeName,
  type ButtonVariantName,
  buttonSizeNames,
  buttonVariantNames,
} from './button-variants.ts'

export interface ButtonControls {
  disabled: boolean
  icon: boolean
  label: string
  loading: boolean
  size: ButtonSizeName
  variant: ButtonVariantName
}

export const buttonControlArgs: ButtonControls = {
  disabled: false,
  icon: false,
  label: 'Create',
  loading: false,
  size: 'default',
  variant: 'default',
}

export const buttonControlArgTypes: Partial<ArgTypes<ButtonControls>> = {
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Button`.',
  },
  icon: {
    control: 'boolean',
    description:
      'Adds a leading icon; the `icon` sizes always show it and nothing else.',
  },
  label: {
    control: 'text',
    description:
      'Text of the button; in the `icon` sizes it becomes the `aria-label`.',
  },
  loading: {
    control: 'boolean',
    description: 'The `loading` of `Button`.',
  },
  size: {
    control: 'select',
    description: 'The `size` of `Button`.',
    options: buttonSizeNames,
  },
  variant: {
    control: 'select',
    description: 'The `variant` of `Button`.',
    options: buttonVariantNames,
  },
}
