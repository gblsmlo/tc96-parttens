import type { ArgTypes } from '@storybook/react-vite'

export interface EmptyState3Controls {
  create: boolean
  description: string
  import: boolean
  templates: boolean
  title: string
}

export const emptyState3ControlArgs: EmptyState3Controls = {
  create: true,
  description:
    'Organize tarefas, prazos e pessoas em um só lugar. Comece do zero ou use um modelo pronto.',
  import: true,
  templates: true,
  title: 'Crie seu primeiro projeto',
}

export const emptyState3ControlArgTypes: Partial<
  ArgTypes<EmptyState3Controls>
> = {
  create: {
    control: 'boolean',
    description: 'Passes `onCreate`; without it the primary action is gone.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`.',
  },
  import: {
    control: 'boolean',
    description: 'Passes `onImport`; without it the secondary action is gone.',
  },
  templates: {
    control: 'boolean',
    description: 'Passes `templates`; without them the list is gone.',
  },
  title: { control: 'text', description: 'Text of `labels.title`.' },
}
