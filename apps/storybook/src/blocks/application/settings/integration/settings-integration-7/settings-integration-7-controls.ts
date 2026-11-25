import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsIntegration7Controls {
  description: string
  empty: boolean
  title: string
  withActions: boolean
  withBuild: boolean
}

export const settingsIntegration7ControlArgs: SettingsIntegration7Controls = {
  description: 'Configure os conectores ou instale novos para o seu espaço.',
  empty: false,
  title: 'Conectores',
  withActions: true,
  withBuild: true,
}

export const settingsIntegration7ControlArgTypes: Partial<
  ArgTypes<SettingsIntegration7Controls>
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
    description: 'Passes `onAction`; off removes every row button.',
  },
  withBuild: {
    control: 'boolean',
    description: 'Passes `onBuild`; off removes the Criar conector button.',
  },
}
