import type { ArgTypes } from '@storybook/react-vite'
import type { Crm2Mode } from '@tc96/ui/blocks/data/crm/crm-2'

export interface Crm2Controls {
  boardHasMore: boolean
  bulkActions: boolean
  create: string
  editable: boolean
  empty: boolean
  headerActions: boolean
  mode: Crm2Mode
  openable: boolean
  paginated: boolean
  savedViews: boolean
  title: string
}

export const crm2ControlArgs: Crm2Controls = {
  boardHasMore: false,
  bulkActions: true,
  create: 'Novo lead',
  editable: true,
  empty: false,
  headerActions: true,
  mode: 'kanban',
  openable: true,
  paginated: true,
  savedViews: true,
  title: 'Leads',
}

export const crm2ControlArgTypes: Partial<ArgTypes<Crm2Controls>> = {
  boardHasMore: {
    control: 'boolean',
    description:
      'Passes `boardHasMore`; on, the Quadro shows the notice that some stages hold only their first leads.',
  },
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange` and the three bulk callbacks; off, the Tabela has no select column and no action bar.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onStageChange`, `onOwnerChange`, `onOriginChange` and `onCreateInStage`; off, the cells are read-only, cards do not move and columns have no add action.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no leads: the Quadro keeps its stage columns, the Tabela shows the empty message.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate`; on, the search field sits before Exibição and Novo lead after it.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
    options: ['kanban', 'table'],
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a card and a row open the lead.',
  },
  paginated: {
    control: 'boolean',
    description:
      'Passes `page`, `pageCount`, `pageSize` and `total`; off, the Tabela has no footer. The Quadro never pages.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `savedViews`, `counts` and the saved view callbacks; on, the view switcher replaces the heading.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the heading, or the name of the section when the view switcher is shown.',
  },
}
