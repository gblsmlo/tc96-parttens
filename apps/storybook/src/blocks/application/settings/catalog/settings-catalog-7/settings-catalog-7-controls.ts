import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsCatalog7Controls {
  allowCustomReason: boolean
  description: string
  empty: boolean
  newReason: string
  requireReason: boolean
  title: string
  withActions: boolean
  withArchived: boolean
}

export const settingsCatalog7ControlArgs: SettingsCatalog7Controls = {
  allowCustomReason: true,
  description:
    'Os motivos que o vendedor pode escolher quando um lead é perdido.',
  empty: false,
  newReason: 'Novo motivo',
  requireReason: false,
  title: 'Motivos de perda',
  withActions: true,
  withArchived: true,
}

export const settingsCatalog7ControlArgTypes: Partial<
  ArgTypes<SettingsCatalog7Controls>
> = {
  allowCustomReason: {
    control: 'boolean',
    description:
      'Passes `allowCustomReason`, the state of the custom reason switch.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `reasons` list, which replaces the reasons by the empty state.',
  },
  newReason: {
    control: 'text',
    description: 'Text of `labels.newReason`, the button of `onCreate`.',
  },
  requireReason: {
    control: 'boolean',
    description:
      'Passes `requireReason`, the state of the required reason switch.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the reasons section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onCreate` and `onReasonAction`; off removes the New reason button and the row menus.',
  },
  withArchived: {
    control: 'boolean',
    description:
      'Passes the archived reasons; off removes the archived collapsible.',
  },
}
