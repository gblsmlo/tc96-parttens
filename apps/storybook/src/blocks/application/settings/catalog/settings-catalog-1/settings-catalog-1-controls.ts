import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsCatalog1Controls {
  description: string
  empty: boolean
  newTag: string
  title: string
  withActions: boolean
}

export const settingsCatalog1ControlArgs: SettingsCatalog1Controls = {
  description: 'Organize leads e tarefas com tags e subtags.',
  empty: false,
  newTag: 'Nova tag',
  title: 'Tags',
  withActions: true,
}

export const settingsCatalog1ControlArgTypes: Partial<
  ArgTypes<SettingsCatalog1Controls>
> = {
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `tags` list, which replaces the rows by the empty state.',
  },
  newTag: {
    control: 'text',
    description: 'Text of `labels.newTag`, the button of `onCreate`.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onCreate` and `onTagAction`; off removes the New tag button and the row menus.',
  },
}
