import type { ArgTypes } from '@storybook/react-vite'

export const actionBarItemVariantNames = [
  'default',
  'primary',
  'destructive',
] as const

export type ActionBarItemVariantName =
  (typeof actionBarItemVariantNames)[number]

export interface ActionBarControls {
  clearButton: boolean
  disabled: boolean
  groupLabels: boolean
  icons: boolean
  label: string
  selectedCount: number
  shortcuts: boolean
  submenu: boolean
  variant: ActionBarItemVariantName
}

export const actionBarControlArgs: ActionBarControls = {
  clearButton: true,
  disabled: false,
  groupLabels: false,
  icons: true,
  label: 'Enviar',
  selectedCount: 1,
  shortcuts: false,
  submenu: true,
  variant: 'primary',
}

export const actionBarControlArgTypes: Partial<ArgTypes<ActionBarControls>> = {
  clearButton: {
    control: 'boolean',
    description:
      'Passes `onClearSelection`, which adds the "Limpar seleção" button at the end.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of the first action.',
  },
  groupLabels: {
    control: 'boolean',
    description:
      'Gives every group a `label`; only the groups inside the submenu render it.',
  },
  icons: {
    control: 'boolean',
    description: 'Gives the actions an `icon` before the label.',
  },
  label: {
    control: 'text',
    description:
      'The `label` of the first action; empty removes the action, and then `variant` and `disabled` act on nothing.',
  },
  selectedCount: {
    control: { min: 0, step: 1, type: 'number' },
    description:
      'The `selectedCount` of `ActionBar`; below 1 the bar renders nothing.',
  },
  shortcuts: {
    control: 'boolean',
    description:
      'Gives every action a `shortcut`, shown after the label, in the bar and in the submenu.',
  },
  submenu: {
    control: 'boolean',
    description:
      'Adds a second group with "Mais opções", an action whose `submenu` opens above the bar.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of the first action.',
    options: actionBarItemVariantNames,
  },
}
