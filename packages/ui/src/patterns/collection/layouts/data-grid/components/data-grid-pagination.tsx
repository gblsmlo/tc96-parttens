'use client'

import type { PaginationState } from '@tanstack/react-table'
import type React from 'react'
import {
  CollectionPagination,
  type CollectionPaginationProps,
} from '../../../shared/components/collection-pagination'

export interface PaginatedTable {
  readonly store: { readonly state: { pagination: PaginationState } }
  getPageCount: () => number
  getRowCount: () => number
  setPageIndex: (pageIndex: number) => void
  setPageSize?: (pageSize: number) => void
}

export interface DataGridPaginationProps
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  buttonLabels?: CollectionPaginationProps['buttonLabels']
  formatRange?: CollectionPaginationProps['formatRange']
  label?: string
  pageSizeLabel?: string
  pageSizeOptions?: readonly number[]
  table: PaginatedTable
}

export function DataGridPagination({
  buttonLabels,
  formatRange,
  label = 'Paginação da tabela',
  pageSizeLabel,
  pageSizeOptions,
  table,
  ...props
}: DataGridPaginationProps): React.ReactElement {
  const { pageIndex, pageSize } = table.store.state.pagination

  return (
    <CollectionPagination
      data-slot="data-grid-pagination"
      buttonLabels={buttonLabels}
      formatRange={formatRange}
      label={label}
      onPageChange={(page) => table.setPageIndex(page - 1)}
      onPageSizeChange={
        table.setPageSize
          ? (size) => {
              table.setPageSize?.(size)
              table.setPageIndex(0)
            }
          : undefined
      }
      page={pageIndex + 1}
      pageCount={table.getPageCount()}
      pageSize={pageSize}
      pageSizeLabel={pageSizeLabel}
      pageSizeOptions={pageSizeOptions}
      total={table.getRowCount()}
      {...props}
    />
  )
}
