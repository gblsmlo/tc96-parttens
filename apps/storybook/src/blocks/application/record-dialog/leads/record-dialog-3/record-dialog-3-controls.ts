import type { ArgTypes } from '@storybook/react-vite'

export interface RecordDialog3Controls {
  titleAncestor: string
}

export const recordDialog3ControlArgs: RecordDialog3Controls = {
  titleAncestor: 'Leads',
}

export const recordDialog3ControlArgTypes: Partial<
  ArgTypes<RecordDialog3Controls>
> = {
  titleAncestor: {
    control: 'text',
    description: 'Text of `labels.titleAncestor`, shown before the title.',
  },
}
