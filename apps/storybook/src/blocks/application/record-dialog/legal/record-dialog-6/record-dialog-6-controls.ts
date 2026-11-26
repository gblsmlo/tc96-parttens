import type { ArgTypes } from '@storybook/react-vite'

export interface RecordDialog6Controls {
  titleAncestor: string
}

export const recordDialog6ControlArgs: RecordDialog6Controls = {
  titleAncestor: 'Processos',
}

export const recordDialog6ControlArgTypes: Partial<
  ArgTypes<RecordDialog6Controls>
> = {
  titleAncestor: {
    control: 'text',
    description: 'Text of `labels.titleAncestor`, shown before the title.',
  },
}
