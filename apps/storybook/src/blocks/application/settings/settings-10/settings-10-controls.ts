import type { ArgTypes } from '@storybook/react-vite'

export interface Settings10Controls {
  description: string
  newStage: string
  title: string
  withActions: boolean
}

export const settings10ControlArgs: Settings10Controls = {
  description: 'Etapas são os passos que um lead percorre, agrupadas por fase',
  newStage: 'Nova etapa',
  title: 'Etapas do funil',
  withActions: true,
}

export const settings10ControlArgTypes: Partial<ArgTypes<Settings10Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    newStage: {
      control: 'text',
      description: 'Text of `labels.newStage`, the button of `onStageCreate`.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onStageCreate` and `onStageAction`; off removes the New stage button and the stage menus.',
    },
  }
