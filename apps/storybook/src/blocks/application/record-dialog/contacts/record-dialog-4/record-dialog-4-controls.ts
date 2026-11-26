import type { ArgTypes } from '@storybook/react-vite'

export interface RecordDialog4Controls {
  titleAncestor: string
}

export const recordDialog4ControlArgs: RecordDialog4Controls = {
  titleAncestor: 'Contatos',
}

export const recordDialog4ControlArgTypes: Partial<
  ArgTypes<RecordDialog4Controls>
> = {
  titleAncestor: {
    control: 'text',
    description: 'Text of `labels.titleAncestor`, shown before the title.',
  },
}
