import type { ArgTypes } from '@storybook/react-vite'
import type { RecordDialog2Slot } from '@tc96/ui/blocks/application/record-dialog/record-dialog-2'
import { recordDialog2Slot } from '../../fixtures/record-dialog-2.ts'

export interface RecordDialog2Controls {
  slot: RecordDialog2Slot
  titleAncestor: string
}

export const recordDialog2ControlArgs: RecordDialog2Controls = {
  slot: recordDialog2Slot,
  titleAncestor: 'Calendário',
}

export const recordDialog2ControlArgTypes: Partial<
  ArgTypes<RecordDialog2Controls>
> = {
  slot: {
    control: 'object',
    description:
      'The day (an ISO instant at noon UTC) and the `HH:mm` window of the Date chip. The dialog reads it when it mounts and when it closes, so a change shows on the next open.',
  },
  titleAncestor: {
    control: 'text',
    description: 'Text of `labels.titleAncestor`, shown before the title.',
  },
}
