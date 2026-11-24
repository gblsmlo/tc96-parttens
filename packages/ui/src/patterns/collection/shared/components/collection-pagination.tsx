'use client'

import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@tc96/ui/pagination'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import type React from 'react'
import { useId } from 'react'

export interface CollectionPaginationButtonLabels {
  first: string
  previous: string
  next: string
  last: string
}

const defaultButtonLabels: CollectionPaginationButtonLabels = {
  first: 'Primeira página',
  last: 'Última página',
  next: 'Próxima página',
  previous: 'Página anterior',
}

export interface CollectionPaginationProps
  extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  /** Nome acessível da navegação, no vocabulário da coleção — `Paginação de contatos`. */
  label: string
  buttonLabels?: Partial<CollectionPaginationButtonLabels>
  formatRange?: (first: number, last: number, total: number) => string
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  /** Página corrente, a partir de 1 — a mesma numeração dos contratos de listagem. */
  page: number
  pageCount: number
  pageSizeLabel?: string
  pageSizeOptions?: readonly number[]
  /** Com `total`, resume o recorte visível (`1–25 de 57`) à esquerda dos controles. */
  pageSize?: number
  total?: number
}

/**
 * A paginação de uma coleção, seja ela servida pelo servidor (contratos com
 * `pagination.page`) ou pelo modelo de paginação de uma tabela. O consumer
 * decide quando mostrá-la; o pacote fixa anatomia, rótulos e estados das pontas.
 */
export function CollectionPagination({
  buttonLabels: buttonLabelsProp,
  className,
  formatRange = defaultFormatRange,
  label,
  onPageChange,
  onPageSizeChange,
  page,
  pageCount,
  pageSize,
  pageSizeLabel,
  pageSizeOptions,
  total,
  ...props
}: CollectionPaginationProps): React.ReactElement {
  const pageSizeLabelId = useId()
  const buttonLabels = { ...defaultButtonLabels, ...buttonLabelsProp }
  const lastPage = Math.max(pageCount, 1)
  const currentPage = Math.min(Math.max(page, 1), lastPage)
  const summary =
    total !== undefined && pageSize !== undefined
      ? summarizeRange(currentPage, pageSize, total, formatRange)
      : null

  const pager = (
    <Pagination aria-label={label} className="mx-0 ml-auto w-auto justify-end">
      <PaginationContent>
        <PaginationItem>
          <Button
            aria-label={buttonLabels.first}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            size="icon-sm"
            variant="ghost"
          >
            <CaretDoubleLeftIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            aria-label={buttonLabels.previous}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            size="icon-sm"
            variant="ghost"
          >
            <CaretLeftIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <span
            aria-current="page"
            className="px-2 text-muted-foreground text-sm tabular-nums"
            data-slot="collection-pagination-page"
          >
            {currentPage} / {lastPage}
          </span>
        </PaginationItem>
        <PaginationItem>
          <Button
            aria-label={buttonLabels.next}
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
            size="icon-sm"
            variant="ghost"
          >
            <CaretRightIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            aria-label={buttonLabels.last}
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(lastPage)}
            size="icon-sm"
            variant="ghost"
          >
            <CaretDoubleRightIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
  const summaryText = summary ? (
    <p
      aria-live="polite"
      className="px-2 text-muted-foreground text-sm tabular-nums"
    >
      {summary}
    </p>
  ) : null
  const showsPageSize = Boolean(
    pageSizeOptions?.length && onPageSizeChange && pageSizeLabel,
  )

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 p-2',
        className,
      )}
      data-slot="collection-pagination"
      {...props}
    >
      {showsPageSize && pageSizeOptions && onPageSizeChange ? (
        <>
          <div
            className="flex items-center gap-2 px-2"
            data-slot="collection-pagination-page-size"
          >
            <span
              className="text-muted-foreground text-sm"
              id={pageSizeLabelId}
            >
              {pageSizeLabel}
            </span>
            <Select
              items={pageSizeOptions.map((size) => ({
                label: String(size),
                value: size,
              }))}
              onValueChange={(size) => {
                if (size !== null) onPageSizeChange(size)
              }}
              value={pageSize ?? null}
            >
              <SelectTrigger
                aria-labelledby={pageSizeLabelId}
                className="min-w-0"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup listProps={{ 'aria-labelledby': pageSizeLabelId }}>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {summaryText}
            {pager}
          </div>
        </>
      ) : (
        <>
          {summaryText}
          {pager}
        </>
      )}
    </div>
  )
}

function defaultFormatRange(first: number, last: number, total: number) {
  return total === 0 ? '0 de 0' : `${first}–${last} de ${total}`
}

function summarizeRange(
  page: number,
  pageSize: number,
  total: number,
  formatRange: (first: number, last: number, total: number) => string,
): string {
  if (total === 0) return formatRange(0, 0, 0)
  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)
  return formatRange(first, last, total)
}
