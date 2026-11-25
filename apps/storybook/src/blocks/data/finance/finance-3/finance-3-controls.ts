import type { ArgTypes } from '@storybook/react-vite'
import type { Finance3Variant } from '@tc96/ui/blocks/data/finance/finance-3'

export interface Finance3Controls {
  allColumns: boolean
  bulkActions: boolean
  create: string
  editable: boolean
  empty: boolean
  headerActions: boolean
  openable: boolean
  paginated: boolean
  truncated: boolean
  variant: Finance3Variant
  viewCounts: boolean
}

export const finance3ControlArgs: Finance3Controls = {
  allColumns: false,
  bulkActions: true,
  create: 'Novo lançamento',
  editable: true,
  empty: false,
  headerActions: true,
  openable: true,
  paginated: true,
  truncated: false,
  variant: 'entries',
  viewCounts: true,
}

export const finance3ControlArgTypes: Partial<ArgTypes<Finance3Controls>> = {
  allColumns: {
    control: 'boolean',
    description:
      'Starts Lançamentos with `hiddenColumns` empty; off, Conta, Categoria, Tipo de honorário and Responsável start hidden, as in lemind.',
  },
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange` and the bulk callbacks (Quitar and Responsável in Lançamentos, Marcar cobrado in A cobrar); off, there is no select column and no action bar.',
  },
  create: {
    control: 'text',
    description:
      'Text of `labels.create`, the primary action of Lançamentos and A cobrar.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onResponsibleChange`, `onAccountChange` and `onCategoryChange`; on, those cells are editable in the rows with `canEdit`.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no records, which renders the empty message.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate` (Lançamentos, A cobrar) and `onExport` (Extrato); off, the toolbar keeps only the views or the heading and Exibição.',
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpen`; on, a row opens the entry (Lançamentos, an Extrato line with an entry) or the client (Dinheiro de clientes).',
  },
  paginated: {
    control: 'boolean',
    description:
      'Passes `page`, `pageCount`, `pageSize` and `total`; off, the footer is not rendered.',
  },
  truncated: {
    control: 'boolean',
    description:
      'Passes `truncated` to A cobrar, which shows the notice that only the 500 most overdue installments are listed.',
  },
  variant: {
    control: 'inline-radio',
    description:
      'The collection: Lançamentos, the A cobrar queue, the Extrato of one account or Dinheiro de clientes. In the story, choosing A cobrar in the views of Lançamentos switches to `receivables`, as the consumer does.',
    options: ['entries', 'receivables', 'statement', 'clientMoney'],
  },
  viewCounts: {
    control: 'boolean',
    description:
      'Passes `counts`; on, each view in the switcher popup shows its count.',
  },
}
