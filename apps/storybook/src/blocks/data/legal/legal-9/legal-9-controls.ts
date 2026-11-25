import type { ArgTypes } from '@storybook/react-vite'
import type {
  Legal9GroupBy,
  Legal9Mode,
} from '@tc96/ui/blocks/data/legal/legal-9'

export interface Legal9Controls {
  bulkActions: boolean
  create: string
  editable: boolean
  empty: boolean
  groupBy: Legal9GroupBy | 'none'
  mode: Legal9Mode
  openable: boolean
  paginated: boolean
  savedViews: boolean
  search: boolean
  title: string
}

export const legal9ControlArgs: Legal9Controls = {
  bulkActions: true,
  create: 'Novo contrato',
  editable: true,
  empty: false,
  groupBy: 'none',
  mode: 'table',
  openable: true,
  paginated: true,
  savedViews: true,
  search: false,
  title: 'Contratos',
}

export const legal9ControlArgTypes: Partial<ArgTypes<Legal9Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange`, `onBulkOwnerChange` and `onBulkBillingModelChange`; off, the table has no select column and no action bar.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onBillingModelChange` and `onOwnerChange`; off, Modelo and Responsável are read-only in every row.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no records, which renders `labels.empty`.',
  },
  groupBy: {
    control: 'inline-radio',
    description:
      'The starting grouping; Agrupar por in Exibição changes it too and calls `onGroupByChange`.',
    options: ['none', 'status', 'billingModel', 'owner'],
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
    options: ['table', 'list'],
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a row and a list title open the record.',
  },
  paginated: {
    control: 'boolean',
    description:
      'Passes `page`, `pageCount`, `pageSize` and `total`; off, the footer is not rendered.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `savedViews`, `viewCount`, the saved view callbacks and `onSavePreference`; off, the toolbar shows the heading instead of the view switcher.',
  },
  search: {
    control: 'boolean',
    description:
      'Passes `onSearchChange`; on, the search field sits before Exibição.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the heading, the name of the section and of the table.',
  },
}
