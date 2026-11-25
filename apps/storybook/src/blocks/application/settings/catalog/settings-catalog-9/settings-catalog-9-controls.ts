import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsCatalog9Controls {
  description: string
  empty: boolean
  newCategory: string
  title: string
  withActions: boolean
  withArchived: boolean
}

export const settingsCatalog9ControlArgs: SettingsCatalog9Controls = {
  description:
    'Como os lançamentos são classificados: honorários, custas, despesas.',
  empty: false,
  newCategory: 'Nova categoria',
  title: 'Categorias',
  withActions: true,
  withArchived: true,
}

export const settingsCatalog9ControlArgTypes: Partial<
  ArgTypes<SettingsCatalog9Controls>
> = {
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `categories` list, which replaces the rows by the empty state.',
  },
  newCategory: {
    control: 'text',
    description: 'Text of `labels.newCategory`, the button of `onCreate`.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onCreate` and `onCategoryAction`; off removes the New category button and the row menus.',
  },
  withArchived: {
    control: 'boolean',
    description:
      'Passes `archivedCategories`; off removes the archived section, which only appears with archived categories.',
  },
}
