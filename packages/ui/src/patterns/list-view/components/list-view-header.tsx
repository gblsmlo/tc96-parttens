import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { cn } from '@tc96/utils'
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'

export type ListViewHeaderProps = ComponentPropsWithoutRef<'div'>
export type ListViewSortDirection = 'asc' | 'desc'

export interface ListViewHeaderCellProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  always?: boolean
  children?: ReactNode
  onSort?: () => void
  sortDirection?: ListViewSortDirection | null
  sortLabel?: string
}

export function ListViewHeader({
  className,
  ...props
}: ListViewHeaderProps): ReactElement {
  return (
    <div
      className={cn(
        'flex h-9 min-w-0 items-center gap-3 px-4 font-medium text-muted-foreground text-sm',
        className,
      )}
      data-slot="list-view-header-row"
      {...props}
    />
  )
}

export function ListViewHeaderCell({
  always = false,
  children,
  className,
  onSort,
  sortDirection = null,
  sortLabel,
  ...props
}: ListViewHeaderCellProps): ReactElement {
  const SortIcon = sortDirection === 'asc' ? ArrowUpIcon : ArrowDownIcon

  return (
    <div
      className={cn(
        'min-w-0 shrink-0 items-center',
        always ? 'flex' : 'hidden lg:flex',
        className,
      )}
      data-slot="list-view-header-cell"
      data-sort={sortDirection ?? undefined}
      {...props}
    >
      {onSort ? (
        <button
          aria-label={sortLabel}
          className={cn(
            'flex min-w-0 items-center gap-1 rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
            sortDirection && 'text-foreground',
          )}
          data-slot="list-view-header-sort"
          onClick={onSort}
          type="button"
        >
          <span className="truncate">{children}</span>
          {sortDirection ? (
            <SortIcon aria-hidden="true" className="size-3.5 shrink-0" />
          ) : null}
        </button>
      ) : (
        <span className="truncate">{children}</span>
      )}
    </div>
  )
}
