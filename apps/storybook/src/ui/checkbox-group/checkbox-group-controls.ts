import type { ArgTypes } from '@storybook/react-vite'
import {
  type FrameworkValue,
  frameworkLabels,
  frameworkValues,
} from './checkbox-group-variants.ts'

export interface CheckboxGroupControls {
  defaultValue: FrameworkValue[]
  disabled: boolean
  disabledItem: boolean
  label: string
  parent: boolean
}

export const checkboxGroupControlArgs: CheckboxGroupControls = {
  defaultValue: ['next'],
  disabled: false,
  disabledItem: false,
  label: 'Frameworks',
  parent: false,
}

export const checkboxGroupControlArgTypes: Partial<
  ArgTypes<CheckboxGroupControls>
> = {
  defaultValue: {
    control: { labels: frameworkLabels, type: 'check' },
    description:
      'The `defaultValue` of `CheckboxGroup`: the items checked on mount.',
    options: frameworkValues,
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `CheckboxGroup`.',
  },
  disabledItem: {
    control: 'boolean',
    description: 'Disables the `Astro` checkbox alone.',
  },
  label: {
    control: 'text',
    description:
      'Text that names the group: the caption above the items, or the label of the parent checkbox; empty removes the caption.',
  },
  parent: {
    control: 'boolean',
    description:
      'Adds a parent checkbox, with `allValues` on the group, that checks or clears every item.',
  },
}
