import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsCatalog3Controls {
  addRule: string
  description: string
  empty: boolean
  title: string
  withActions: boolean
}

export const settingsCatalog3ControlArgs: SettingsCatalog3Controls = {
  addRule: 'Adicionar regra',
  description:
    'Use regras de automação para adicionar ou remover SLAs automaticamente com base em filtros.',
  empty: false,
  title: 'Regras de automação',
  withActions: true,
}

export const settingsCatalog3ControlArgTypes: Partial<
  ArgTypes<SettingsCatalog3Controls>
> = {
  addRule: {
    control: 'text',
    description: 'Text of `labels.addRule`, the button of `onCreate`.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `rules` list, which replaces the rules by the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onCreate` and `onRuleAction`; off removes the Add rule button and the row menus.',
  },
}
