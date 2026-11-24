import type { ArgTypes } from '@storybook/react-vite'

export interface EmptyState5Controls {
  connect: boolean
  title: string
}

export const emptyState5ControlArgs: EmptyState5Controls = {
  connect: true,
  title: 'Nenhum armazenamento conectado',
}

export const emptyState5ControlArgTypes: Partial<
  ArgTypes<EmptyState5Controls>
> = {
  connect: {
    control: 'boolean',
    description: 'Passes `onConnect`, which renders the connect buttons.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`.',
  },
}
