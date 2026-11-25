import type { ArgTypes } from '@storybook/react-vite'
import type { KanbanCardDisplay } from '@tc96/ui/patterns'

export interface KanbanCardControls {
  description: boolean
  dimmed: boolean
  display: KanbanCardDisplay
  fields: boolean
  footer: boolean
  loading: boolean
  menu: boolean
  openTrigger: boolean
  selected: boolean
  title: string
}

export const kanbanCardControlArgs: KanbanCardControls = {
  description: true,
  dimmed: false,
  display: 'full',
  fields: true,
  footer: true,
  loading: false,
  menu: true,
  openTrigger: true,
  selected: false,
  title: 'Primeiro card',
}

export const kanbanCardControlArgTypes: Partial<ArgTypes<KanbanCardControls>> =
  {
    description: {
      control: 'boolean',
      description: 'Adds a `KanbanCardDescription` to the header.',
    },
    dimmed: {
      control: 'boolean',
      description: 'The `dimmed` of `KanbanCard`.',
    },
    display: {
      control: 'inline-radio',
      description: 'The `display` of `KanbanCard`.',
      options: ['full', 'compact'],
    },
    fields: {
      control: 'boolean',
      description: 'Adds a `KanbanCardBody` with two fields.',
    },
    footer: {
      control: 'boolean',
      description:
        'Adds a `KanbanCardFooter` with a count menu and the assignee.',
    },
    menu: {
      control: 'boolean',
      description: 'Adds a `KanbanCardAction` with a menu to the header.',
    },
    openTrigger: {
      control: 'boolean',
      description:
        'Adds a `KanbanCardOpenTrigger` and sets `variant="interactive"`.',
    },
    selected: {
      control: 'boolean',
      description: 'The `selected` of `KanbanCard`.',
    },
    title: {
      control: 'text',
      description: 'The text of `KanbanCardTitle`.',
    },
  }
