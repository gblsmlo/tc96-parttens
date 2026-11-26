import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type { Inbox1Labels } from './types'

export interface Inbox1FooterProps {
  labels: Inbox1Labels
  markError: boolean
  onPageChange: (page: number) => void
  page: number
  pageCount?: number
  pageSize?: number
  total?: number
}

export function Inbox1Footer({
  labels,
  markError,
  onPageChange,
  page,
  pageCount,
  pageSize,
  total,
}: Readonly<Inbox1FooterProps>) {
  if (!markError && pageCount === undefined) return null

  return (
    <div className="flex flex-col gap-2" data-slot="inbox-1-footer">
      {markError ? (
        <p
          className="text-center text-destructive-foreground text-sm"
          role="alert"
        >
          {labels.markError}
        </p>
      ) : null}
      {pageCount !== undefined ? (
        <CollectionPagination
          buttonLabels={labels.paginationButtons}
          formatRange={labels.pageRange}
          label={labels.pagination}
          onPageChange={onPageChange}
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          total={total}
        />
      ) : null}
    </div>
  )
}
