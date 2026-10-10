import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { RecordGroupItemProps } from '../../core'

export function RecordGroupItem({
  children,
  className,
  leading,
  title,
}: Readonly<RecordGroupItemProps>): ReactElement {
  return (
    <div
      className={cn(
        'flex min-h-9 min-w-0 items-center gap-2 px-2 text-sm',
        className,
      )}
      data-slot="record-group-item"
    >
      {leading ? (
        <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">
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
          className="flex min-w-0 max-w-1/2 shrink-0 items-center justify-end"
          data-slot="record-group-item-trailing"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
