import type { ArgTypes } from '@storybook/react-vite'
import type { Crm3Mode } from '@tc96/ui/blocks/data/crm/crm-3'

export interface Crm3Controls {
  boardHasMore: boolean
  bulkActions: boolean
  create: string
  editable: boolean
  empty: boolean
  filters: boolean
  headerActions: boolean
  mode: Crm3Mode
  openable: boolean
  paginated: boolean
  title: string
}

export const crm3ControlArgs: Crm3Controls = {
  boardHasMore: false,
  bulkActions: true,
  create: 'Novo lead',
  editable: true,
  empty: false,
  filters: true,
  headerActions: true,
  mode: 'kanban',
  openable: true,
  paginated: true,
  title: 'Leads',
}

export const crm3ControlArgTypes: Partial<ArgTypes<Crm3Controls>> = {
  boardHasMore: {
    control: 'boolean',
    description:
      'Passes `boardHasMore`; on, the Quadro shows the notice that some stages hold only their first leads.',
  },
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange` and the three bulk callbacks; off, the Tabela has no select column and no `ActionBar`.',
  },
  create: {
    control: 'text',
    description:
      'Text of `labels.create`, the primary `Action`, last in the toolbar.',
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
  filters: {
    control: 'boolean',
    description:
      'Passes the Etapa, Responsável, Origem, Tags and Arquivados filter callbacks; on, the filter menu opens the right slot with one submenu per property and a count badge.',
  },
  headerActions: {
    control: 'boolean',
    description: 'Passes `onCreate`; on, the `Action` closes the toolbar.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The initial layout; the layout menu changes it too and calls `onModeChange`.',
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
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and of the collection.',
  },
}
