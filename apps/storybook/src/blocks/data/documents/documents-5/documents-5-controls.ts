import type { ArgTypes } from '@storybook/react-vite'
import type {
  Documents5GroupBy,
  Documents5Mode,
} from '@tc96/ui/blocks/data/documents/documents-5'

export interface Documents5Controls {
  create: string
  createActions: boolean
  empty: boolean
  filters: boolean
  groupBy: Documents5GroupBy | 'none'
  mode: Documents5Mode
  openable: boolean
  pinned: boolean
  rowActions: boolean
  selectable: boolean
  title: string
}

export const documents5ControlArgs: Documents5Controls = {
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

export const documents5ControlArgTypes: Partial<ArgTypes<Documents5Controls>> =
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
        'Passes `onTypeFilterChange` and `onOwnerFilterChange`; on, the display settings add a Filters section with one submenu per property, and the trigger shows the active count.',
    },
    groupBy: {
      control: 'inline-radio',
      description:
        'The initial `groupBy`; the Group by submenu of the display settings changes it too. The gallery never groups.',
      options: ['none', 'type', 'owner'],
    },
    mode: {
      control: 'inline-radio',
      description:
        'The initial layout; the layout tabs of the display settings change it too and call `onModeChange`.',
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
