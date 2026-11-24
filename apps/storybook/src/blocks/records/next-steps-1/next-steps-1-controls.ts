import type { ArgTypes } from '@storybook/react-vite'

export interface NextSteps1Controls {
  dismiss: boolean
  tasks: boolean
  title: string
}

export const nextSteps1ControlArgs: NextSteps1Controls = {
  dismiss: true,
  tasks: true,
  title: 'Próximos passos',
}

export const nextSteps1ControlArgTypes: Partial<ArgTypes<NextSteps1Controls>> =
  {
    dismiss: {
      control: 'boolean',
      description: 'Passes `onDismiss`, which adds Dispensar to the header.',
    },
    tasks: {
      control: 'boolean',
      description:
        'Passes two `tasks` under the status rows; off removes them.',
    },
    title: {
      control: 'text',
      description: 'The `title` label of the section.',
    },
  }
