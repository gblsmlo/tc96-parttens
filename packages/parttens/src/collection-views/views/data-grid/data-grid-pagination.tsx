'use client'

import type { PaginationState } from '@tanstack/react-table'
import type React from 'react'
import { CollectionPagination } from '../../../shared/components/collection-pagination'

/**
 * O que o rodapé lê de uma tabela TanStack. Qualquer instância que registre
 * `rowPaginationFeature` serve — a do DataGrid ou a da DataTable.
 */
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

/**
 * Rodapé de paginação de uma tabela TanStack, cliente ou controlada: lê o
 * modelo da tabela e o entrega à `CollectionPagination`, que é a autoridade
 * visual — a tabela não desenha uma paginação própria.
 */
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
