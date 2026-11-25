import type { ArgTypes } from '@storybook/react-vite'
import type { Legal3Mode } from '@tc96/ui/blocks/data/legal/legal-3'

export interface Legal3Controls {
  create: string
  editable: boolean
  empty: boolean
  headerActions: boolean
  mode: Legal3Mode
  openable: boolean
  title: string
}

export const legal3ControlArgs: Legal3Controls = {
  create: 'Novo prazo',
  editable: true,
  empty: false,
  headerActions: true,
  mode: 'table',
  openable: true,
  title: 'Prazos',
}

export const legal3ControlArgTypes: Partial<ArgTypes<Legal3Controls>> = {
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
    options: ['table', 'list', 'calendar'],
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpen`; on, a row, a list title and a calendar item open the record.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the toolbar heading and the name of the section and the table.',
  },
}
