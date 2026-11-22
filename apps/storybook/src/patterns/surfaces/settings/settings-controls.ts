import type { ArgTypes } from '@storybook/react-vite'

export const settingsControlNames = [
  'none',
  'text',
  'switch',
  'select',
  'input',
  'menu',
] as const

export type SettingsControlName = (typeof settingsControlNames)[number]

export interface SettingsControls {
  action: boolean
  control: SettingsControlName
  description: string
  group: boolean
  groupActions: boolean
  groupOpen: boolean
  icon: boolean
  rowDescription: string
  rowTitle: string
  title: string
}

export const settingsControlArgs: SettingsControls = {
  action: true,
  control: 'switch',
  description: 'Choose what reaches you and how.',
  group: true,
  groupActions: false,
  groupOpen: true,
  icon: true,
  rowDescription: "Sends a summary of the day's activity",
  rowTitle: 'Email notifications',
  title: 'Notifications',
}

export const settingsControlArgTypes: Partial<ArgTypes<SettingsControls>> = {
  action: {
    control: 'boolean',
    description:
      'Adds a `Button` to the `actions` of `SettingsSectionHeader`, outside the card. Acts only with a title.',
  },
  control: {
    control: 'select',
    description:
      'The control the consumer passes to the `endSlot` of the first row. `none` leaves the slot out.',
    options: settingsControlNames,
  },
  description: {
    control: 'text',
    description:
      'Text of `SettingsSectionDescription`; empty removes the part. Acts only with a title.',
  },
  group: {
    control: 'boolean',
    description:
      'Adds a `SettingsCollapsed` group of rows after the plain rows, in a `div` that is a single child of the section.',
  },
  groupActions: {
    control: 'boolean',
    description:
      'Adds a `Button` to the `actions` of the group; it stays visible while the group is closed. Acts only with `group`.',
  },
  groupOpen: {
    control: 'boolean',
    description:
      'The `defaultOpen` of `SettingsCollapsed`; the group remounts when it changes. Acts only with `group`.',
  },
  icon: {
    control: 'boolean',
    description: 'Passes an icon to the `startSlot` of the first row.',
  },
  rowDescription: {
    control: 'text',
    description: 'The `description` of the first row; empty removes it.',
  },
  rowTitle: {
    control: 'text',
    description:
      'The `title` of the first row; it also names the control in its `endSlot`.',
  },
  title: {
    control: 'text',
    description:
      'Text of `SettingsSectionTitle`; empty leaves out the whole `header`, so the section becomes a plain card with no heading.',
  },
}
