import type { ArgTypes } from '@storybook/react-vite'
import type { BulkImport1Step } from '@tc96/blocks/records/bulk-import-1'

export interface BulkImport1Controls {
  importing: boolean
  progress: boolean
  searching: boolean
  step: BulkImport1Step
  title: string
}

export const bulkImport1ControlArgs: BulkImport1Controls = {
  importing: false,
  progress: false,
  searching: false,
  step: 'select',
  title: 'Importar contatos',
}

export const bulkImport1ControlArgTypes: Partial<
  ArgTypes<BulkImport1Controls>
> = {
  importing: {
    control: 'boolean',
    description:
      'The `importing` of `BulkImport1`: the submit shows Importando… and Voltar is disabled.',
  },
  progress: {
    control: 'boolean',
    description: 'Passes sample `progress` rows to the link step.',
  },
  searching: {
    control: 'boolean',
    description:
      'The `searching` of `BulkImport1`: the table shows skeleton rows.',
  },
  step: {
    control: 'inline-radio',
    description: 'The `step` of `BulkImport1`.',
    options: ['select', 'link'],
  },
  title: {
    control: 'text',
    description: 'The `title` label, which names the dialog.',
  },
}
