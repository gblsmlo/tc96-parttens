import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

export interface AssetListProps extends ComponentProps<'ul'> {}

export function AssetList({
  className,
  ...props
}: Readonly<AssetListProps>): ReactElement {
  return (
    <ul
      className={cn('divide-y divide-border/40', className)}
      data-slot="asset-list"
      {...props}
    />
  )
}

export interface AssetListItemProps
  extends Omit<ComponentProps<'li'>, 'title' | 'value'> {
  icon?: ReactNode
  /** Informação secundária à direita, como a variação em 24h. */
  meta?: ReactNode
  name: ReactNode
  value: ReactNode
}

export function AssetListItem({
  className,
  icon,
  meta,
  name,
  value,
  ...props
}: Readonly<AssetListItemProps>): ReactElement {
  return (
    <li
      className={cn(
        'flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0',
        className,
      )}
      data-slot="asset-list-item"
      {...props}
    >
      {icon}
      <div className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-muted-foreground text-sm">{name}</span>
        <span className="truncate font-semibold text-sm tabular-nums">
          {value}
        </span>
      </div>
      {meta ? (
        <div className="shrink-0 self-end text-muted-foreground text-sm tabular-nums">
          {meta}
        </div>
      ) : null}
    </li>
  )
}
