'use client'

import type { Table as TanstackTable } from '@tanstack/react-table'
import type React from 'react'
import { CollectionPagination } from '../../shared/components/collection-pagination'

export interface DataGridPaginationProps<TData>
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  table: TanstackTable<TData>
}

/**
 * Rodapé de paginação de uma tabela TanStack, cliente ou controlada: lê o
 * modelo da tabela e o entrega à `CollectionPagination`, que é a autoridade
 * visual — a tabela não desenha uma paginação própria.
 */
export function DataGridPagination<TData>({
  table,
  ...props
}: DataGridPaginationProps<TData>): React.ReactElement {
  const { pageIndex, pageSize } = table.getState().pagination

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
