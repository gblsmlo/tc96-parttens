import type { ArgTypes } from '@storybook/react-vite'
import type { Legal5Mode } from '@tc96/ui/blocks/data/legal/legal-5'

export interface Legal5Controls {
  bulkActions: boolean
  catalogsLoading: boolean
  create: string
  editable: boolean
  empty: boolean
  groupBy: 'none' | 'owner' | 'phase'
  headerActions: boolean
  mode: Legal5Mode
  openable: boolean
  paginated: boolean
  savedViews: boolean
  title: string
  viewCounts: boolean
}

export const legal5ControlArgs: Legal5Controls = {
  bulkActions: true,
  catalogsLoading: false,
  create: 'Novo processo',
  editable: true,
  empty: false,
  groupBy: 'none',
  headerActions: true,
  mode: 'table',
  openable: true,
  paginated: true,
  savedViews: true,
  title: 'Processos',
  viewCounts: true,
}

export const legal5ControlArgTypes: Partial<ArgTypes<Legal5Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange` and the four bulk callbacks; off, the table has no select column and no action bar.',
  },
  catalogsLoading: {
    control: 'boolean',
    description:
      'Passes `phasesLoading`, `ownersLoading`, `clientsLoading` and `tagsLoading`; on, the Fase, Responsável, Cliente and Tags submenus show skeleton rows and the tag picker of a row says it is loading.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onPhaseChange`, `onOwnerChange`, `onTagsChange` and `onUnarchive`; off, Fase, Responsável and Tags are read-only and Desarquivar is not rendered.',
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
    options: ['none', 'phase', 'owner'],
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate`; on, the search field sits before Exibição and Novo processo after it; off, the toolbar keeps only the views and Exibição.',
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
      'Passes `savedViews`, `savedViewId`, `savedViewModified`, the saved view callbacks and `onSavePreference`; on, the switcher lists Minhas visões after the views and Exibição ends with Salvar preferência.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and of the table.',
  },
  viewCounts: {
    control: 'boolean',
    description:
      'Passes `counts`; on, each view in the switcher popup shows its count and is named by `labels.viewCountName`.',
  },
}
