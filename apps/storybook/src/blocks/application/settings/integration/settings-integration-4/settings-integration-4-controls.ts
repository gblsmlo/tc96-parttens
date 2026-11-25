import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsIntegration4Controls {
  description: string
  empty: boolean
  title: string
  withActions: boolean
  withCreate: boolean
}

export const settingsIntegration4ControlArgs: SettingsIntegration4Controls = {
  description: 'Aplicativos conectados ao seu espaço, agrupados por tipo.',
  empty: false,
  title: 'Conexões',
  withActions: true,
  withCreate: true,
}

export const settingsIntegration4ControlArgTypes: Partial<
  ArgTypes<SettingsIntegration4Controls>
> = {
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `sections` list, which replaces the groups by the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the block.',
  },
  withActions: {
    control: 'boolean',
    description: 'Passes `onAction`; off removes the row menus.',
  },
  withCreate: {
    control: 'boolean',
    description: 'Passes `onCreate`; off removes the Nova conexão button.',
  },
}
