import type { ArgTypes } from '@storybook/react-vite'

export const toolbarOrientationNames = ['horizontal', 'vertical'] as const

export type ToolbarOrientationName = (typeof toolbarOrientationNames)[number]

export interface ToolbarControls {
  action: string
  disabled: boolean
  disabledGroup: boolean
  groups: boolean
  input: boolean
  link: string
  orientation: ToolbarOrientationName
  separators: boolean
}

export const toolbarControlArgs: ToolbarControls = {
  action: 'Save',
  disabled: false,
  disabledGroup: false,
  groups: true,
  input: false,
  link: '',
  orientation: 'horizontal',
  separators: true,
}

export const toolbarControlArgTypes: Partial<ArgTypes<ToolbarControls>> = {
  action: {
    control: 'text',
    description:
      'Text of the last `ToolbarButton`, rendered as a `Button`; empty removes it.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Toolbar`, which disables every item.',
  },
  disabledGroup: {
    control: 'boolean',
    description:
      'The `disabled` of the formatting `ToolbarGroup`, which disables only its items; does nothing when `groups` is off.',
  },
  groups: {
    control: 'boolean',
    description:
      'Wraps the history and formatting buttons in a `ToolbarGroup` each; off, they sit directly in the toolbar.',
  },
  input: {
    control: 'boolean',
    description: 'Adds a `ToolbarInput` for a search term before the action.',
  },
  link: {
    control: 'text',
    description: 'Text of a `ToolbarLink` at the start; empty removes it.',
  },
  orientation: {
    control: 'inline-radio',
    description:
      'The `orientation` of `Toolbar`; for `vertical` the toolbar and its groups also stack their items in a column.',
    options: toolbarOrientationNames,
  },
  separators: {
    control: 'boolean',
    description: 'Adds a `ToolbarSeparator` between the groups of items.',
  },
}
