'use client'

import type { PaginationState } from '@tanstack/react-table'
import type React from 'react'
import { CollectionPagination } from '../../../../shared/components/collection-pagination'

export interface PaginatedTable {
  readonly store: { readonly state: { pagination: PaginationState } }
  getPageCount: () => number
  getRowCount: () => number
  setPageIndex: (pageIndex: number) => void
}

export interface DataGridPaginationProps
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  table: PaginatedTable
}

export function DataGridPagination({
  table,
  ...props
}: DataGridPaginationProps): React.ReactElement {
  const { pageIndex, pageSize } = table.store.state.pagination

  return (
    <CollectionPagination
      data-slot="data-grid-pagination"
      label="Paginação da tabela"
      onPageChange={(page) => table.setPageIndex(page - 1)}
      page={pageIndex + 1}
      pageCount={table.getPageCount()}
      pageSize={pageSize}
      total={table.getRowCount()}
      {...props}
    />
  )
}
