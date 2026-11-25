import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsWorkspace1Controls {
  deleteWorkspace: string
  name: string
  slug: string
  title: string
}

export const settingsWorkspace1ControlArgs: SettingsWorkspace1Controls = {
  deleteWorkspace: 'Excluir workspace',
  name: 'Acme Labs',
  slug: 'acme-labs',
  title: 'Workspace',
}

export const settingsWorkspace1ControlArgTypes: Partial<
  ArgTypes<SettingsWorkspace1Controls>
> = {
  deleteWorkspace: {
    control: 'text',
    description: 'Text of `labels.deleteWorkspace`, the danger button.',
  },
  name: {
    control: 'text',
    description:
      'Passes `name`, the value of the name field; the field restarts when it changes.',
  },
  slug: {
    control: 'text',
    description:
      'Passes `slug`, the value of the URL field; the field restarts when it changes.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.workspaceTitle`, the heading of the section.',
  },
}
