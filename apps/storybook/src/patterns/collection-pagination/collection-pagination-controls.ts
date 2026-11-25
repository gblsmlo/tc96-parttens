import type { ArgTypes } from '@storybook/react-vite'

export interface CollectionPaginationControls {
  label: string
  pageSizeLabel: string
  pageSizeSelector: boolean
  range: boolean
}

export const collectionPaginationControlArgs: CollectionPaginationControls = {
  label: 'Paginação de contatos',
  pageSizeLabel: 'Linhas por página',
  pageSizeSelector: false,
  range: true,
}

export const collectionPaginationControlArgTypes: Partial<
  ArgTypes<CollectionPaginationControls>
> = {
  label: {
    control: 'text',
    description:
      'The `label` of `CollectionPagination`, the name of its `nav`.',
  },
  pageSizeLabel: {
    control: 'text',
    description: 'The `pageSizeLabel` of `CollectionPagination`.',
    if: { arg: 'pageSizeSelector' },
  },
  pageSizeSelector: {
    control: 'boolean',
    description:
      'Passes `pageSizeOptions` (10, 25, 50) and `onPageSizeChange`, which add the rows-per-page selector.',
  },
  range: {
    control: 'boolean',
    description:
      'Passes `pageSize` and `total` (57 records), which add the range on screen.',
  },
}
