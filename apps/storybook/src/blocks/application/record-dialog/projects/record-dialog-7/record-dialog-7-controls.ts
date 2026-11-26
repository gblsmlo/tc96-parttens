import type { ArgTypes } from '@storybook/react-vite'

export interface RecordDialog7Controls {
  titleAncestor: string
}

export const recordDialog7ControlArgs: RecordDialog7Controls = {
  titleAncestor: 'Lemind',
}

export const recordDialog7ControlArgTypes: Partial<
  ArgTypes<RecordDialog7Controls>
> = {
  titleAncestor: {
    control: 'text',
    description: 'Text of `labels.titleAncestor`, shown before the title.',
  },
}
