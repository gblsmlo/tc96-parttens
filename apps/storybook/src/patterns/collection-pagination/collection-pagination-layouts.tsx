import {
  CollectionPagination,
  type CollectionPaginationProps,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import type { CollectionPaginationControls } from './collection-pagination-controls.ts'

const ignore = () => undefined

export interface ComposedCollectionPaginationProps
  extends CollectionPaginationControls {
  initialPage?: number
  initialPageSize?: number
  total?: number
}

export function ComposedCollectionPagination({
  initialPage = 1,
  initialPageSize = 25,
  label,
  pageSizeLabel,
  pageSizeSelector,
  range,
  total = 57,
}: Readonly<ComposedCollectionPaginationProps>) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const pageCount = Math.ceil(total / pageSize)

  return (
    <CollectionPagination
      label={label}
      onPageChange={setPage}
      onPageSizeChange={
        pageSizeSelector
          ? (next) => {
              setPageSize(next)
              setPage(1)
            }
          : undefined
      }
      page={page}
      pageCount={pageCount}
      pageSize={range || pageSizeSelector ? pageSize : undefined}
      pageSizeLabel={pageSizeSelector ? pageSizeLabel : undefined}
      pageSizeOptions={pageSizeSelector ? [10, 25, 50] : undefined}
      total={range ? total : undefined}
    />
  )
}

export function StatefulPagination({
  onPageChange = ignore,
  page: initialPage,
  ...props
}: Readonly<CollectionPaginationProps>) {
  const [page, setPage] = useState(initialPage)

  return (
    <CollectionPagination
      {...props}
      onPageChange={(next) => {
        setPage(next)
        onPageChange(next)
      }}
      page={page}
    />
  )
}

export const PageSizeSelectorAtStartLayout = (
  props: Readonly<ComposedCollectionPaginationProps>,
) => <ComposedCollectionPagination {...props} pageSizeSelector />
