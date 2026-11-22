import type { ArgTypes } from '@storybook/react-vite'
import type { ChecklistDensity, ChecklistVariant } from '@tc96/parttens'
import { checklistDensities, checklistVariants } from './checklist-variants.ts'

export interface ChecklistControls {
  author: boolean
  creating: boolean
  deleteButton: boolean
  density: ChecklistDensity
  dueDate: boolean
  empty: boolean
  feedback: string
  openable: boolean
  progress: boolean
  readOnly: boolean
  title: string
  variant: ChecklistVariant
}

export const checklistControlArgs: ChecklistControls = {
  author: true,
  creating: false,
  deleteButton: true,
  density: 'md',
  dueDate: true,
  empty: false,
  feedback: '',
  openable: false,
  progress: false,
  readOnly: false,
  title: 'Etapas',
  variant: 'card',
}

export const checklistControlArgTypes: Partial<ArgTypes<ChecklistControls>> = {
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
  openable: {
    control: 'boolean',
    description:
      'Passes `onItemClick`, which turns every title into a button that opens the item.',
  },
  progress: {
    control: 'boolean',
    description: 'The `progress` of `Checklist`: adds the progress bar.',
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
    description: 'The `variant` of `Checklist`.',
    options: checklistVariants,
  },
}
