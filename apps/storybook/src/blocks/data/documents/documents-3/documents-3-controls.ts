import type { ArgTypes } from '@storybook/react-vite'
import type { Documents3Mode } from '@tc96/ui/blocks/data/documents/documents-3'

export interface Documents3Controls {
  create: boolean
  empty: boolean
  groupBy: 'none' | 'pinned' | 'type'
  mode: Documents3Mode
  openable: boolean
  paginated: boolean
  rowActions: boolean
  savedViews: boolean
  searchable: boolean
  title: string
  typeColors: boolean
  uploads: boolean
  viewCounts: boolean
}

export const documents3ControlArgs: Documents3Controls = {
  create: true,
  empty: false,
  groupBy: 'none',
  mode: 'gallery',
  openable: true,
  paginated: false,
  rowActions: true,
  savedViews: false,
  searchable: true,
  title: 'Documentos',
  typeColors: true,
  uploads: false,
  viewCounts: true,
}

export const documents3ControlArgTypes: Partial<ArgTypes<Documents3Controls>> =
  {
    create: {
      control: 'boolean',
      description:
        'Passes `onCreatePage`, `onCreateNote`, `onCreateLink` and `onUpload`; on, Novo opens a menu with Documento, Nota, Weblink and Enviar arquivo; off, Novo is not rendered.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes no records, which renders the empty message of the active view.',
    },
    groupBy: {
      control: 'inline-radio',
      description:
        'The grouping of the Tabela and the Lista; Agrupar por in Exibição changes it too and calls `onGroupByChange`.',
      options: ['none', 'pinned', 'type'],
    },
    mode: {
      control: 'inline-radio',
      description:
        'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
      options: ['gallery', 'table', 'list'],
    },
    openable: {
      control: 'boolean',
      description:
        'Passes `onOpen`; on, a row and a list title open the item, except while it uploads or after its upload failed.',
    },
    paginated: {
      control: 'boolean',
      description:
        'Passes `page`, `pageCount`, `pageSize` and `total`; off, the footer is not rendered.',
    },
    rowActions: {
      control: 'boolean',
      description:
        'Passes `onDownload`, `onRename`, `onPinnedChange`, `onShare` and `onDelete`; off, the rows have no actions menu, or only Abrir with `openable`.',
    },
    savedViews: {
      control: 'boolean',
      description:
        'Passes `savedViews`, `savedViewId`, the saved view callbacks and `onSavePreference`; on, the switcher lists Minhas visões after the views and Exibição ends with Salvar preferência.',
    },
    searchable: {
      control: 'boolean',
      description:
        'Passes `onSearchChange`, `onSortChange` and `onTypeFilterChange`; off, the toolbar keeps only the views, Exibição with the mode tabs, and Novo.',
    },
    title: {
      control: 'text',
      description:
        'Text of `labels.title`: the name of the section and of the table.',
    },
    typeColors: {
      control: 'boolean',
      description:
        'Passes `typeColors`; off, the type icon keeps the muted frame of `IconFrame`.',
    },
    uploads: {
      control: 'boolean',
      description:
        'Adds a file at 45% of its upload and a file whose upload failed, both with `upload` on the record.',
    },
    viewCounts: {
      control: 'boolean',
      description:
        'Passes `counts`; on, each view in the switcher popup shows its count and is named by `labels.viewCountName`.',
    },
  }
