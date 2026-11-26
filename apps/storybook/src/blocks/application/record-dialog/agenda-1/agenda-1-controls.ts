import type { ArgTypes } from '@storybook/react-vite'
import type { Agenda1Slot } from '@tc96/ui/blocks/application/record-dialog/agenda-1'
import { agenda1Slot } from '../fixtures/agenda-1.ts'

export interface Agenda1Controls {
  slot: Agenda1Slot
  titleAncestor: string
}

export const agenda1ControlArgs: Agenda1Controls = {
  slot: agenda1Slot,
  titleAncestor: 'Calendário',
}

export const agenda1ControlArgTypes: Partial<ArgTypes<Agenda1Controls>> = {
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
