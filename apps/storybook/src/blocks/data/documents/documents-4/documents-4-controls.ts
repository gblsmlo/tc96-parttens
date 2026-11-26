import type { ArgTypes } from '@storybook/react-vite'
import type {
  Documents4GroupBy,
  Documents4Mode,
} from '@tc96/ui/blocks/data/documents/documents-4'

export interface Documents4Controls {
  create: string
  createActions: boolean
  empty: boolean
  filters: boolean
  groupBy: Documents4GroupBy | 'none'
  mode: Documents4Mode
  openable: boolean
  pinned: boolean
  rowActions: boolean
  selectable: boolean
  title: string
}

export const documents4ControlArgs: Documents4Controls = {
  create: 'Novo',
  createActions: true,
  empty: false,
  filters: true,
  groupBy: 'none',
  mode: 'list',
  openable: true,
  pinned: true,
  rowActions: true,
  selectable: true,
  title: 'Todos os documentos',
}

export const documents4ControlArgTypes: Partial<ArgTypes<Documents4Controls>> =
  {
    create: {
      control: 'text',
      description:
        'Text of `labels.create`, the trigger of the create menu, last in the toolbar.',
    },
    createActions: {
      control: 'boolean',
      description:
        'Passes `onCreateNote`, `onCreateLink` and `onUpload`; on, the create menu closes the toolbar.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes no records and no pinned records, which renders `labels.empty` and hides the pinned row.',
    },
    filters: {
      control: 'boolean',
      description:
        'Passes `onTypeFilterChange` and `onOwnerFilterChange`; on, the filter menu opens the right slot with one submenu per property and a count badge.',
    },
    groupBy: {
      control: 'inline-radio',
      description:
        'The initial `groupBy`; the group menu changes it too. The gallery never groups.',
      options: ['none', 'type', 'owner'],
    },
    mode: {
      control: 'inline-radio',
      description:
        'The initial layout; the layout menu changes it too and calls `onModeChange`.',
      options: ['list', 'table', 'gallery'],
    },
    openable: {
      control: 'boolean',
      description:
        'Passes `onOpen`; on, a row, a gallery card and a pinned card open the document.',
    },
    pinned: {
      control: 'boolean',
      description:
        'Passes `pinnedRecords`; on, the pinned row sits between the toolbar and the collection.',
    },
    rowActions: {
      control: 'boolean',
      description:
        'Passes `onDownload`, `onPinnedChange` and `onDelete`; on, each record has its actions menu and each pinned card its unpin button.',
    },
    selectable: {
      control: 'boolean',
      description:
        'Passes `onBulkDownload`, `onBulkPinnedChange` and `onBulkDelete`; on, the list and the table select records and open the `ActionBar`.',
    },
    title: {
      control: 'text',
      description:
        'Text of `labels.title`: the fixed view, the name of the section and of the collection.',
    },
  }
