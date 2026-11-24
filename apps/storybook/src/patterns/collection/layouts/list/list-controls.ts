import type { ArgTypes } from '@storybook/react-vite'
import type { ListRowDensity } from '@tc96/ui/patterns'

export interface ListControls {
  action: boolean
  addAction: boolean
  collapseEmptyGroups: boolean
  density: ListRowDensity
  description: boolean
  empty: boolean
  emptyGroupLabel: string
  emptyMessage: string
  field: boolean
  grouped: boolean
  interactive: boolean
  leading: boolean
  loading: boolean
  separated: boolean
  trigger: boolean
}

export const listControlArgs: ListControls = {
  action: true,
  addAction: false,
  collapseEmptyGroups: false,
  density: 'comfortable',
  description: true,
  empty: false,
  emptyGroupLabel: 'Nenhum registro neste grupo.',
  emptyMessage: 'Nenhum registro para exibir.',
  field: true,
  grouped: true,
  interactive: true,
  leading: true,
  loading: false,
  separated: false,
  trigger: true,
}

export const listControlArgTypes: Partial<ArgTypes<ListControls>> = {
  action: {
    control: 'boolean',
    description:
      'Adds a `ListRowAction` with a menu button to every row; the skeleton follows.',
  },
  addAction: {
    control: 'boolean',
    description:
      'Passes `onAddRecord` in `getGroupActions`: adds the plus button to each group header.',
  },
  collapseEmptyGroups: {
    control: 'boolean',
    description:
      'The `collapseEmptyGroups` of `ListView`: the empty group starts closed.',
  },
  density: {
    control: 'inline-radio',
    description: 'The `density` of every `ListRow`.',
    options: ['comfortable', 'compact'],
  },
  description: {
    control: 'boolean',
    description:
      'Adds a `ListRowDescription` to every row; the skeleton follows.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes a collection with no records.',
  },
  emptyGroupLabel: {
    control: 'text',
    description:
      'The `emptyGroupLabel` of `ListView`, shown in the empty last group.',
  },
  emptyMessage: {
    control: 'text',
    description:
      'The `emptyMessage` of `ListView`, shown when `empty` is on and `grouped` is off.',
  },
  field: {
    control: 'boolean',
    description:
      'Adds a `ListRowField` with a date to every row; the skeleton follows.',
  },
  grouped: {
    control: 'boolean',
    description:
      'Passes `grouping="status"`; off passes `null`, a flat list with no group headers.',
  },
  interactive: {
    control: 'boolean',
    description: 'The `interactive` of every `ListRow`: the hover surface.',
  },
  leading: {
    control: 'boolean',
    description: 'Adds a `ListRowLeading` with an icon; the skeleton follows.',
  },
  loading: {
    control: 'boolean',
    description: 'The `loading` of `ListView`: renders skeleton rows.',
  },
  separated: {
    control: 'boolean',
    description: 'The `separated` of `ListView`: a line between rows.',
  },
  trigger: {
    control: 'boolean',
    description:
      'Wraps every title in a `ListRowTitleTrigger`, which opens the row.',
  },
}
