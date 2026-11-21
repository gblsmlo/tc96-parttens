import type { ArgTypes } from '@storybook/react-vite'
import {
  type ToggleSizeName,
  type ToggleVariantName,
  toggleSizeNames,
  toggleVariantNames,
} from './toggle-variants.ts'

export interface ToggleControls {
  disabled: boolean
  icon: boolean
  iconOnly: boolean
  label: string
  pressed: boolean
  size: ToggleSizeName
  variant: ToggleVariantName
}

export const toggleControlArgs: ToggleControls = {
  disabled: false,
  icon: false,
  iconOnly: false,
  label: 'Bold',
  pressed: false,
  size: 'default',
  variant: 'default',
}

export const toggleControlArgTypes: Partial<ArgTypes<ToggleControls>> = {
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Toggle`.',
  },
  icon: {
    control: 'boolean',
    description: 'Adds a leading icon; `iconOnly` always shows it.',
  },
  iconOnly: {
    control: 'boolean',
    description:
      'Removes the text and keeps the icon; the label becomes the `aria-label`.',
  },
  label: {
    control: 'text',
    description:
      'Text of the toggle; with `iconOnly` it becomes the `aria-label`.',
  },
  pressed: {
    control: 'boolean',
    description: 'Starts the toggle on, through `defaultPressed`.',
  },
  size: {
    control: 'select',
    description: 'The `size` of `Toggle`.',
    options: toggleSizeNames,
  },
  variant: {
    control: 'select',
    description: 'The `variant` of `Toggle`.',
    options: toggleVariantNames,
  },
}
