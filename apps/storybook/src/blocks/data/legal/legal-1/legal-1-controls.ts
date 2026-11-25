import type { ArgTypes } from '@storybook/react-vite'
import type { Legal1Mode } from '@tc96/ui/blocks/data/legal/legal-1'

export interface Legal1Controls {
  create: string
  editable: boolean
  empty: boolean
  headerActions: boolean
  mode: Legal1Mode
  openable: boolean
  title: string
}

export const legal1ControlArgs: Legal1Controls = {
  create: 'Novo processo',
  editable: true,
  empty: false,
  headerActions: true,
  mode: 'table',
  openable: true,
  title: 'Processos',
}

export const legal1ControlArgTypes: Partial<ArgTypes<Legal1Controls>> = {
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onStatusChange`, `onQueueChange`, `onOwnerChange` and `onPhaseChange`; off, the properties are read-only and the Kanban cards do not drag.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no cases, which renders the empty message of the active mode.',
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
    options: ['table', 'list', 'kanban'],
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpen`; on, a row, a list title and a Kanban card open the case.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the toolbar heading and the name of the section and the table.',
  },
}
