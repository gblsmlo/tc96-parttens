import type { ArgTypes } from '@storybook/react-vite'

export interface EmptyState6Controls {
  tab: string
  tabs: string
}

export const emptyState6ControlArgs: EmptyState6Controls = {
  tab: 'notifications',
  tabs: 'Configurações',
}

export const emptyState6ControlArgTypes: Partial<
  ArgTypes<EmptyState6Controls>
> = {
  tab: {
    control: 'inline-radio',
    description: 'The `id` of the tab that starts selected.',
    options: ['notifications', 'security', 'integrations'],
  },
  tabs: {
    control: 'text',
    description: 'Text of `labels.tabs`, the accessible name of the tab list.',
  },
}
