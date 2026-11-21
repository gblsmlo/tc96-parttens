import { Button } from '@tc96/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@tc96/ui/pagination'
import type { PaginationControls } from './pagination-controls.ts'
import { pageLinkSizes, paginationPages } from './pagination-variants.ts'

interface ComposedPaginationProps extends PaginationControls {
  onPageChange?: (page: number) => void
}

export const ComposedPagination = ({
  activePage,
  element,
  ellipsis,
  next,
  onPageChange,
  pages,
  previous,
  size,
}: Readonly<ComposedPaginationProps>) => {
  const asButton = element === 'button'
  const lastPage = paginationPages.length
  const currentPage = Math.min(Math.max(activePage, 1), lastPage)
  const previousPage = Math.max(currentPage - 1, 1)
  const nextPage = Math.min(currentPage + 1, lastPage)

  const pageTarget = (page: number) =>
    asButton
      ? {
          onClick: () => onPageChange?.(page),
          render: (
            <Button
              size={pageLinkSizes[size]}
              variant={page === activePage ? 'outline' : 'ghost'}
            />
          ),
        }
      : { href: `#page-${page}`, size: pageLinkSizes[size] }

  const edgeTarget = (page: number) =>
    asButton
      ? {
          onClick: () => onPageChange?.(page),
          render: <Button size={size} variant="ghost" />,
        }
      : { href: `#page-${page}`, size }

  return (
    <Pagination>
      <PaginationContent>
        {previous ? (
          <PaginationItem>
            <PaginationPrevious {...edgeTarget(previousPage)} />
          </PaginationItem>
        ) : null}
        {(pages ? paginationPages : []).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === activePage || undefined}
              {...pageTarget(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {ellipsis ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {next ? (
          <PaginationItem>
            <PaginationNext {...edgeTarget(nextPage)} />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  )
}
