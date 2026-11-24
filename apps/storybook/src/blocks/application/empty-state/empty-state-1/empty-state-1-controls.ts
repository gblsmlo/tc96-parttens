import type { ArgTypes } from '@storybook/react-vite'

export interface EmptyState1Controls {
  create: boolean
  description: string
  guides: boolean
  import: boolean
  title: string
}

export const emptyState1ControlArgs: EmptyState1Controls = {
  create: true,
  description:
    'Importe uma planilha para começar com seus dados ou cadastre o primeiro registro à mão.',
  guides: true,
  import: true,
  title: 'Nenhum dado por aqui ainda',
}

export const emptyState1ControlArgTypes: Partial<
  ArgTypes<EmptyState1Controls>
> = {
  create: {
    control: 'boolean',
    description: 'Passes `onCreate`; without it the secondary action is gone.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`.',
  },
  guides: {
    control: 'boolean',
    description: 'Passes `guides`; without them the list is gone.',
  },
  import: {
    control: 'boolean',
    description: 'Passes `onImport`; without it the primary action is gone.',
  },
  title: { control: 'text', description: 'Text of `labels.title`.' },
}
