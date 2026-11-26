import type { ArgTypes } from '@storybook/react-vite'
import type { Agenda2Slot } from '@tc96/ui/blocks/application/record-dialog/agenda-2'
import { agenda2Slot } from '../fixtures/agenda-2.ts'

export interface Agenda2Controls {
  slot: Agenda2Slot
  titleAncestor: string
}

export const agenda2ControlArgs: Agenda2Controls = {
  slot: agenda2Slot,
  titleAncestor: 'Calendário',
}

export const agenda2ControlArgTypes: Partial<ArgTypes<Agenda2Controls>> = {
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
