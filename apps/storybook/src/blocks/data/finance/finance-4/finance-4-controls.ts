import type { ArgTypes } from '@storybook/react-vite'
import type {
  Finance4GroupBy,
  Finance4Mode,
} from '@tc96/ui/blocks/data/finance/finance-4'

export interface Finance4Controls {
  create: string
  empty: boolean
  filters: boolean
  groupBy: Finance4GroupBy | 'none'
  headerActions: boolean
  mode: Finance4Mode
  openable: boolean
  selectable: boolean
  title: string
}

export const finance4ControlArgs: Finance4Controls = {
  create: 'Novo lançamento',
  empty: false,
  filters: true,
  groupBy: 'situation',
  headerActions: true,
  mode: 'list',
  openable: true,
  selectable: true,
  title: 'Lançamentos',
}

export const finance4ControlArgTypes: Partial<ArgTypes<Finance4Controls>> = {
  create: {
    control: 'text',
    description:
      'Text of `labels.create`, the primary `Action`, last in the toolbar.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no entries, which renders `labels.empty`.',
  },
  filters: {
    control: 'boolean',
    description:
      'Passes `onSituationFilterChange`, `onKindFilterChange` and `onLawyerFilterChange`; on, the filter menu opens the right slot with one submenu per property and a count badge.',
  },
  groupBy: {
    control: 'inline-radio',
    description:
      'The initial `groupBy`; the group menu changes it too. The Kanban always groups by Situação.',
    options: ['none', 'situation', 'kind', 'client', 'case'],
  },
  headerActions: {
    control: 'boolean',
    description: 'Passes `onCreate`; on, the `Action` closes the toolbar.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The initial layout; the layout menu changes it too and calls `onModeChange`.',
    options: ['list', 'table', 'kanban'],
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpen`; on, a row, a table row and a Kanban card open the entry.',
  },
  selectable: {
    control: 'boolean',
    description:
      'Passes `onBulkSettle`, `onBulkResponsibleChange` and `onBulkDelete`; on, the list and the table select entries and open the `ActionBar`.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and of the collection.',
  },
}
