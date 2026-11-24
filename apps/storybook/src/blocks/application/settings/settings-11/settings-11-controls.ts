import type { ArgTypes } from '@storybook/react-vite'

export interface Settings11Controls {
  description: string
  newStatus: string
  title: string
  withActions: boolean
}

export const settings11ControlArgs: Settings11Controls = {
  description:
    'Os status definem o fluxo que os projetos percorrem do início à conclusão',
  newStatus: 'Novo status',
  title: 'Status de projetos',
  withActions: true,
}

export const settings11ControlArgTypes: Partial<ArgTypes<Settings11Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    newStatus: {
      control: 'text',
      description: 'Text of `labels.newStatus`, the button of `onCreate`.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onCreate` and `onStatusAction`; off removes the New status button and the row menus.',
    },
  }
