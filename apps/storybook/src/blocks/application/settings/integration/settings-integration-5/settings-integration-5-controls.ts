import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsIntegration5Controls {
  description: string
  empty: boolean
  title: string
  withActions: boolean
}

export const settingsIntegration5ControlArgs: SettingsIntegration5Controls = {
  description: 'Conecte aplicativos e escolha quais eventos eles recebem.',
  empty: false,
  title: 'Eventos por integração',
  withActions: true,
}

export const settingsIntegration5ControlArgTypes: Partial<
  ArgTypes<SettingsIntegration5Controls>
> = {
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `apps` list, which replaces the rows by the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onConnect`, `onDisconnect` and `onChannelChange`; off removes every row button.',
  },
}
