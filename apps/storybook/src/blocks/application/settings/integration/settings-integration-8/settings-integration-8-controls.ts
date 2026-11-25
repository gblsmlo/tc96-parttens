import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsIntegration8Controls {
  allPaused: boolean
  description: string
  empty: boolean
  title: string
  withActions: boolean
}

export const settingsIntegration8ControlArgs: SettingsIntegration8Controls = {
  allPaused: false,
  description: 'Acompanhe as chaves e o uso de cada integração de API.',
  empty: false,
  title: 'Integrações de API',
  withActions: true,
}

export const settingsIntegration8ControlArgTypes: Partial<
  ArgTypes<SettingsIntegration8Controls>
> = {
  allPaused: {
    control: 'boolean',
    description:
      'Passes `allPaused`; on, every row switch is off and disabled.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `integrations` list, which replaces the grid by the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onCopyKey`, `onEnabledChange` and `onAllPausedChange`; off removes the copy buttons and the pause switch and disables the row switches.',
  },
}
