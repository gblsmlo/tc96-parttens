import { cn } from '@tc96/utils'
import type { ComponentPropsWithoutRef, ReactElement } from 'react'

export type DataTableTitleCellProps = ComponentPropsWithoutRef<'div'>
export type DataTableTitleProps = ComponentPropsWithoutRef<'span'>
export type DataTableDescriptionProps = ComponentPropsWithoutRef<'span'>

export function DataTableTitleCell({
  className,
  ...props
}: DataTableTitleCellProps): ReactElement {
  return (
    <div
      className={cn('grid min-w-0 gap-0.5', className)}
      data-slot="data-table-title-cell"
      {...props}
    />
  )
}

export function DataTableTitle({
  className,
  ...props
}: DataTableTitleProps): ReactElement {
  return (
    <span
      className={cn('min-w-0 truncate font-medium text-sm', className)}
      data-slot="data-table-title"
      {...props}
    />
  )
}

export function DataTableDescription({
  className,
  ...props
}: DataTableDescriptionProps): ReactElement {
  return (
    <span
      className={cn(
        'min-w-0 truncate text-muted-foreground text-sm',
        className,
      )}
      data-slot="data-table-description"
      {...props}
    />
  )
}
