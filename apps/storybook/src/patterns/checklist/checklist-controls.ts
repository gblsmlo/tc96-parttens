import type { ArgTypes } from '@storybook/react-vite'
import type { ChecklistDensity, ChecklistVariant } from '@tc96/ui/patterns'
import { checklistDensities, checklistVariants } from './checklist-variants.ts'

export interface ChecklistControls {
  addLabel: string
  author: boolean
  creating: boolean
  deleteButton: boolean
  density: ChecklistDensity
  dueDate: boolean
  empty: boolean
  feedback: string
  filter: boolean
  openable: boolean
  readOnly: boolean
  title: string
  variant: ChecklistVariant
}

export const checklistControlArgs: ChecklistControls = {
  addLabel: 'Adicionar etapas',
  author: true,
  creating: false,
  deleteButton: true,
  density: 'md',
  dueDate: true,
  empty: false,
  feedback: '',
  filter: true,
  openable: false,
  readOnly: false,
  title: 'Etapas',
  variant: 'complete',
}

export const checklistControlArgTypes: Partial<ArgTypes<ChecklistControls>> = {
  addLabel: {
    control: 'text',
    description:
      'The `addLabel` of `Checklist`: text of the trigger button and label of the `+` action.',
  },
  author: {
    control: 'boolean',
    description:
      'Gives every item an `authorId`, shown as the author property.',
  },
  creating: {
    control: 'boolean',
    description: 'The `creating` of `Checklist`: disables the draft row.',
  },
  deleteButton: {
    control: 'boolean',
    description:
      'Passes `onItemDelete`, which adds a delete button to every row, shown on hover and focus.',
  },
  density: {
    control: 'inline-radio',
    description: 'The `density` of `Checklist`.',
    options: checklistDensities,
  },
  dueDate: {
    control: 'boolean',
    description: 'Gives every item a `dueDate` (yesterday, today, tomorrow).',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no `items`; the draft row shows a plus icon.',
  },
  feedback: {
    control: 'text',
    description:
      'Text of the `feedback` slot after the list; empty removes it.',
  },
  filter: {
    control: 'boolean',
    description:
      'Passes `filter`, a Status filter (Abertas, Concluídas) beside the `+` of the group, and filters the items passed in. Shown by `trigger` and `complete`.',
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onItemClick`, which turns every title into a button that opens the item.',
  },
  readOnly: {
    control: 'boolean',
    description: 'The `readOnly` of `Checklist`.',
  },
  title: {
    control: 'text',
    description: 'The `title` of `Checklist`; empty passes `null`.',
  },
  variant: {
    control: 'inline-radio',
    description:
      'The `variant` of `Checklist`: `card` frames the list, `plain` leaves the frame to a parent, `trigger` shows only an add button until there are items, and `complete` renders the list in a collapsible `RecordGroup` with a count.',
    options: checklistVariants,
  },
}
