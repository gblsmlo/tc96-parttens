import type { ArgTypes } from '@storybook/react-vite'
import type { KanbanCardDisplay } from '@tc96/ui/patterns'

export interface KanbanControls {
  addAction: boolean
  collapsed: boolean
  colors: boolean
  description: boolean
  dimmed: boolean
  display: KanbanCardDisplay
  emptyColumnLabel: string
  fields: boolean
  footer: boolean
  hidden: boolean
  loading: boolean
  menu: boolean
  openTrigger: boolean
  selected: boolean
  settingsAction: boolean
}

export const kanbanControlArgs: KanbanControls = {
  addAction: true,
  collapsed: false,
  colors: true,
  description: true,
  dimmed: false,
  display: 'full',
  emptyColumnLabel: 'Nenhum card nesta coluna.',
  fields: true,
  footer: true,
  hidden: false,
  loading: false,
  menu: true,
  openTrigger: true,
  selected: false,
  settingsAction: false,
}

export const kanbanControlArgTypes: Partial<ArgTypes<KanbanControls>> = {
  addAction: {
    control: 'boolean',
    description:
      'Passes `onAddCard` in `getColumnActions`: adds the plus button to each open column header.',
  },
  collapsed: {
    control: 'boolean',
    description: 'Sets `collapsed` on the first column.',
  },
  colors: {
    control: 'boolean',
    description:
      'Gives each column a `color`: the marker dot and the tinted surface.',
  },
  description: {
    control: 'boolean',
    description:
      'Adds a `KanbanCardDescription` to every card; the skeleton follows.',
  },
  dimmed: {
    control: 'boolean',
    description: 'The `dimmed` of the first `KanbanCard`.',
  },
  display: {
    control: 'inline-radio',
    description: 'The `display` of every `KanbanCard`.',
    options: ['full', 'compact'],
  },
  emptyColumnLabel: {
    control: 'text',
    description:
      'The `emptyColumnLabel` of `KanbanView`, shown in the empty last column.',
  },
  fields: {
    control: 'boolean',
    description:
      'Adds a `KanbanCardBody` with two fields to every card; the skeleton follows.',
  },
  footer: {
    control: 'boolean',
    description:
      'Adds a `KanbanCardFooter` with a count menu and the assignee to every card; the skeleton follows.',
  },
  hidden: {
    control: 'boolean',
    description: 'Sets `hidden` on the last column.',
  },
  loading: {
    control: 'boolean',
    description: 'The `loading` of `KanbanView`: renders skeleton cards.',
  },
  menu: {
    control: 'boolean',
    description:
      'Adds a `KanbanCardAction` with a menu to every card; the skeleton follows.',
  },
  openTrigger: {
    control: 'boolean',
    description:
      'Adds a `KanbanCardOpenTrigger` to every card and sets `variant="interactive"`.',
  },
  selected: {
    control: 'boolean',
    description: 'The `selected` of the first `KanbanCard`.',
  },
  settingsAction: {
    control: 'boolean',
    description:
      'Passes `onOpenSettings` in `getColumnActions`: adds the settings button to each column header.',
  },
}
