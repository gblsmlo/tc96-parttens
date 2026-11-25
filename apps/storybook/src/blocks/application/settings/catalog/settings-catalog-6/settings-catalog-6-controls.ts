import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsCatalog6Controls {
  blockStageChanges: boolean
  description: string
  empty: boolean
  gatesTitle: string
  newAction: string
  title: string
  withActions: boolean
}

export const settingsCatalog6ControlArgs: SettingsCatalog6Controls = {
  blockStageChanges: false,
  description:
    'Ações que um lead precisa cumprir antes de sair de cada etapa aberta.',
  empty: false,
  gatesTitle: 'Bloqueio de etapas',
  newAction: 'Nova ação',
  title: 'Próximas ações',
  withActions: true,
}

export const settingsCatalog6ControlArgTypes: Partial<
  ArgTypes<SettingsCatalog6Controls>
> = {
  blockStageChanges: {
    control: 'boolean',
    description:
      'Passes `blockStageChanges`, the state of the gate switch under the gates title.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `stages` list, which replaces the stages by the empty state.',
  },
  gatesTitle: {
    control: 'text',
    description:
      'Text of `labels.gatesTitle`, the heading of the gates section.',
  },
  newAction: {
    control: 'text',
    description: 'Text of `labels.newAction`, the button of `onCreate`.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the actions section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onCreate` and `onNextActionAction`; off removes the New action button and the row menus.',
  },
}
