import type { ArgTypes } from '@storybook/react-vite'

export interface RecordDialog5Controls {
  recordName: string
}

export const recordDialog5ControlArgs: RecordDialog5Controls = {
  recordName: 'Helena Duarte',
}

export const recordDialog5ControlArgTypes: Partial<
  ArgTypes<RecordDialog5Controls>
> = {
  recordName: {
    control: 'text',
    description: 'Text of `recordName`, shown as the trail before the title.',
  },
}
