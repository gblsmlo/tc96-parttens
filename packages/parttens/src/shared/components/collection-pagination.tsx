'use client'

import { Button } from '@tc96/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@tc96/ui/pagination'
import { cn } from '@tc96/utils'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import type React from 'react'

export interface CollectionPaginationProps
  extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  /** Nome acessível da navegação, no vocabulário da coleção — `Paginação de contatos`. */
  label: string
  onPageChange: (page: number) => void
  /** Página corrente, a partir de 1 — a mesma numeração dos contratos de listagem. */
  page: number
  pageCount: number
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
  className,
  label,
  onPageChange,
  page,
  pageCount,
  pageSize,
  total,
  ...props
}: CollectionPaginationProps): React.ReactElement {
  const lastPage = Math.max(pageCount, 1)
  const currentPage = Math.min(Math.max(page, 1), lastPage)
  const summary =
    total !== undefined && pageSize !== undefined
      ? summarizeRange(currentPage, pageSize, total)
      : null

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 p-2',
        className,
      )}
      data-slot="collection-pagination"
      {...props}
    >
      {summary ? (
        <p
          aria-live="polite"
          className="px-2 text-muted-foreground text-sm tabular-nums"
        >
          {summary}
        </p>
      ) : null}
      <Pagination
        aria-label={label}
        className="mx-0 ml-auto w-auto justify-end"
      >
        <PaginationContent>
          <PaginationItem>
            <Button
              aria-label="Primeira página"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(1)}
              size="icon-sm"
              variant="ghost"
            >
              <ChevronsLeftIcon />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              aria-label="Página anterior"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              size="icon-sm"
              variant="ghost"
            >
              <ChevronLeftIcon />
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
              aria-label="Próxima página"
              disabled={currentPage >= lastPage}
              onClick={() => onPageChange(currentPage + 1)}
              size="icon-sm"
              variant="ghost"
            >
              <ChevronRightIcon />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              aria-label="Última página"
              disabled={currentPage >= lastPage}
              onClick={() => onPageChange(lastPage)}
              size="icon-sm"
              variant="ghost"
            >
              <ChevronsRightIcon />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function summarizeRange(page: number, pageSize: number, total: number): string {
  if (total === 0) return '0 de 0'
  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)
  return `${first}–${last} de ${total}`
}
