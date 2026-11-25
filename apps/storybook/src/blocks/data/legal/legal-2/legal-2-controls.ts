import type { ArgTypes } from '@storybook/react-vite'
import type { Legal2Mode } from '@tc96/ui/blocks/data/legal/legal-2'

export interface Legal2Controls {
  create: string
  editable: boolean
  empty: boolean
  headerActions: boolean
  mode: Legal2Mode
  openable: boolean
  title: string
}

export const legal2ControlArgs: Legal2Controls = {
  create: 'Novo contrato',
  editable: true,
  empty: false,
  headerActions: true,
  mode: 'table',
  openable: true,
  title: 'Contratos',
}

export const legal2ControlArgTypes: Partial<ArgTypes<Legal2Controls>> = {
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onStatusChange`, `onQueueChange` and `onOwnerChange`; off, the properties are read-only.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no records, which renders the empty message of the active mode.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onExport` and `onCreate`; off, the toolbar keeps only Exibição.',
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
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the toolbar heading and the name of the section and the table.',
  },
}
