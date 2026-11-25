import type { ArgTypes } from '@storybook/react-vite'
import {
  type Legal6Props,
  type Legal6View,
  legal6Views,
} from '@tc96/ui/blocks/data/legal/legal-6'

export interface Legal6Controls {
  catalogsLoading: boolean
  counts: boolean
  create: string
  dateFormat: NonNullable<Legal6Props['dateFormat']>
  decides: boolean
  empty: boolean
  headerActions: boolean
  loadMoreError: boolean
  manager: boolean
  openable: boolean
  savedViews: boolean
  title: string
  view: Legal6View
}

export const legal6ControlArgs: Legal6Controls = {
  catalogsLoading: false,
  counts: true,
  create: 'Novo prazo',
  dateFormat: 'numeric',
  decides: true,
  empty: false,
  headerActions: true,
  loadMoreError: false,
  manager: true,
  openable: true,
  savedViews: true,
  title: 'Prazos',
  view: 'mine',
}

export const legal6ControlArgTypes: Partial<ArgTypes<Legal6Controls>> = {
  catalogsLoading: {
    control: 'boolean',
    description:
      'Passes `ownersLoading` and `kindsLoading`; on, the Responsável and Tipo submenus show skeleton rows.',
  },
  counts: {
    control: 'boolean',
    description:
      'Passes `counts`; on, each queue in the switcher popup shows its count, named by `labels.viewCountName`.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  dateFormat: {
    control: 'inline-radio',
    description:
      'How Data interna and Data fatal read: `numeric` is `dd/mm/aaaa`, `short` is the short form of `DateProperty` (`24 de nov.`).',
    options: ['numeric', 'short'],
  },
  decides: {
    control: 'boolean',
    description:
      'Passes `onConfirm` and `onReject`; on, the Propostos queue shows the Decisão column.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no records, which renders the empty message of the active queue and, with counts, the link to the next queue with items.',
  },
  headerActions: {
    control: 'boolean',
    description: 'Passes `onCreate`; off, the toolbar keeps only Exibição.',
  },
  loadMoreError: {
    control: 'boolean',
    description:
      'Passes `loadMoreError`, which renders the alert above Carregar mais.',
  },
  manager: {
    control: 'boolean',
    description:
      'On, `views` is omitted and the eight queues show; off, `views` keeps Minha fila, Atrasados, Hoje e amanhã and Até 5 dias úteis.',
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a row opens the deadline.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `savedViews`, `savedViewId`, `savedViewModified`, the saved view callbacks and `onSavePreference`; on, the switcher lists Minhas visões after the queues and Exibição ends with Salvar preferência.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and the first part of the table name.',
  },
  view: {
    control: 'select',
    description:
      'The active queue; the view switcher changes it too and calls `onViewChange`.',
    options: [...legal6Views],
  },
}
