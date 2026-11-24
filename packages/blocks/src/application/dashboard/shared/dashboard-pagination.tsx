import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@tc96/ui/pagination'
import type { DashboardPagination as DashboardPaginationData } from './types'

export interface DashboardPaginationProps extends DashboardPaginationData {
  label: string
  nextLabel: string
  onPageChange: (page: number) => void
  pageOf: (page: number, pageCount: number) => string
  previousLabel: string
}

export function DashboardPagination({
  label,
  nextLabel,
  onPageChange,
  page,
  pageCount,
  pageOf,
  previousLabel,
}: Readonly<DashboardPaginationProps>) {
  const lastPage = Math.max(pageCount, 1)
  const currentPage = Math.min(Math.max(page, 1), lastPage)

  return (
    <Pagination
      aria-label={label}
      className="mx-0 w-full justify-end"
      data-slot="dashboard-pagination"
    >
      <PaginationContent>
        <PaginationItem>
          <span
            aria-current="page"
            className="px-2 text-muted-foreground text-sm tabular-nums"
          >
            {pageOf(currentPage, lastPage)}
          </span>
        </PaginationItem>
        <PaginationItem>
          <Button
            aria-label={previousLabel}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            size="icon-sm"
            variant="outline"
          >
            <CaretLeftIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            aria-label={nextLabel}
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
            size="icon-sm"
            variant="outline"
          >
            <CaretRightIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
