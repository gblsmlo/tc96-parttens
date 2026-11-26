import type { ArgTypes } from '@storybook/react-vite'
import type { RecordDialog1Slot } from '@tc96/ui/blocks/application/record-dialog/record-dialog-1'
import { recordDialog1Slot } from '../../fixtures/record-dialog-1.ts'

export interface RecordDialog1Controls {
  slot: RecordDialog1Slot
  titleAncestor: string
}

export const recordDialog1ControlArgs: RecordDialog1Controls = {
  slot: recordDialog1Slot,
  titleAncestor: 'Calendário',
}

export const recordDialog1ControlArgTypes: Partial<
  ArgTypes<RecordDialog1Controls>
> = {
  slot: {
    control: 'object',
    description:
      'The day (an ISO instant at noon UTC) and the `HH:mm` window of the Date row. The dialog reads it when it mounts and when it closes, so a change shows on the next open.',
  },
  titleAncestor: {
    control: 'text',
    description: 'Text of `labels.titleAncestor`, shown before the title.',
  },
}
