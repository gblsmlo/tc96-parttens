import type { ArgTypes } from '@storybook/react-vite'

export const tableVariants = ['default', 'card'] as const

export type TableVariantName = (typeof tableVariants)[number]

export const tableContainers = ['div', 'section'] as const

export type TableContainerName = (typeof tableContainers)[number]

export interface TableControls {
  caption: string
  container: TableContainerName
  footer: boolean
  selectedRow: boolean
  selection: boolean
  variant: TableVariantName
}

export const tableControlArgs: TableControls = {
  caption: 'Projects this quarter.',
  container: 'div',
  footer: false,
  selectedRow: false,
  selection: false,
  variant: 'default',
}

export const tableControlArgTypes: Partial<ArgTypes<TableControls>> = {
  caption: {
    control: 'text',
    description:
      'Text of `TableCaption`, which also names the table; empty removes the part.',
  },
  container: {
    control: 'inline-radio',
    description:
      'Changes the container element through `render`, not the `table`: `section` is a focusable scroll region named "Projects".',
    options: tableContainers,
  },
  footer: {
    control: 'boolean',
    description: 'Adds a `TableFooter` with a total row.',
  },
  selectedRow: {
    control: 'boolean',
    description:
      'Sets `data-state="selected"` on the second row, and checks its checkbox when `selection` is on.',
  },
  selection: {
    control: 'boolean',
    description:
      'Adds a first column of `Checkbox`es, with a select-all checkbox in the header.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `Table`.',
    options: tableVariants,
  },
}
