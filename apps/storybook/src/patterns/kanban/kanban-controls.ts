import type { ArgTypes } from '@storybook/react-vite'

export interface KanbanControls {
  addAction: boolean
  collapsed: boolean
  description: boolean
  emptyGroupLabel: string
  fields: boolean
  footer: boolean
  hidden: boolean
  loading: boolean
  menu: boolean
  openTrigger: boolean
  settingsAction: boolean
}

export const kanbanControlArgs: KanbanControls = {
  addAction: true,
  collapsed: false,
  description: true,
  emptyGroupLabel: 'Nenhum card nesta coluna.',
  fields: true,
  footer: true,
  hidden: false,
  loading: false,
  menu: true,
  openTrigger: true,
  settingsAction: false,
}

export const kanbanControlArgTypes: Partial<ArgTypes<KanbanControls>> = {
  addAction: {
    control: 'boolean',
    description:
      'Passes `onRecordAdd` in `getGroupActions`: adds the plus button to each open column header.',
  },
  collapsed: {
    control: 'boolean',
    description: 'Adds the first column to `collapsedGroupIds`.',
  },
  description: {
    control: 'boolean',
    description:
      'Adds a `KanbanCardDescription` to every card; the skeleton follows.',
  },
  emptyGroupLabel: {
    control: 'text',
    description:
      'The `emptyGroupLabel` of `KanbanView`, shown in the empty last column.',
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
      'Adds a `KanbanCardOpenTrigger` to every card and sets `interactive`.',
  },
  settingsAction: {
    control: 'boolean',
    description:
      'Passes `colorOptions` and `onColorChange` in `getGroupActions` and `onCollapsedGroupIdsChange` to the view: the settings button opens a popover with the color swatches and the collapse switch.',
  },
}
