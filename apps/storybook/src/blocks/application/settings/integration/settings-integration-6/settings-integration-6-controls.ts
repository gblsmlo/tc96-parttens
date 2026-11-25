import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsIntegration6Controls {
  description: string
  empty: boolean
  title: string
  withActions: boolean
}

export const settingsIntegration6ControlArgs: SettingsIntegration6Controls = {
  description: 'Conecte ferramentas e pause cada integração quando precisar.',
  empty: false,
  title: 'Galeria de integrações',
  withActions: true,
}

export const settingsIntegration6ControlArgTypes: Partial<
  ArgTypes<SettingsIntegration6Controls>
> = {
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `apps` list, which replaces the cards by the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onConnect`, `onDisconnect` and `onEnabledChange`; off removes every card button and keeps the switches inert.',
  },
}
