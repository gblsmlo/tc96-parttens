import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { RecordGroupItemProps } from '../../core'
import {
  recordGroupLinkOffsetClassName,
  recordGroupRowHeightClassName,
  recordGroupRowPaddingClassName,
} from '../../lib/variants'

export function RecordGroupItem({
  children,
  className,
  interactive = false,
  leading,
  title,
}: Readonly<RecordGroupItemProps>): ReactElement {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2 text-sm',
        recordGroupRowHeightClassName,
        interactive
          ? cn(
              'rounded-md transition-colors hover:bg-accent',
              recordGroupLinkOffsetClassName,
            )
          : recordGroupRowPaddingClassName,
        className,
      )}
      data-interactive={interactive ? 'true' : undefined}
      data-slot="record-group-item"
    >
      {leading ? (
        <span className="flex shrink-0 items-center text-muted-foreground [&>svg]:size-4">
          {leading}
        </span>
      ) : null}
      <span
        className="min-w-0 flex-1 truncate"
        data-slot="record-group-item-title"
      >
        {title}
      </span>
      {children ? (
        <div
          className="flex min-w-0 max-w-1/2 shrink-0 items-center justify-end gap-1"
          data-slot="record-group-item-trailing"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
