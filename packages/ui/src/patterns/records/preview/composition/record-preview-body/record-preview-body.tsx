import { cn } from '@tc96/utils'
import type * as React from 'react'
import type { RecordPreviewBodyProps } from '../../core'

export function RecordPreviewBody({
  children,
  className,
}: Readonly<RecordPreviewBodyProps>): React.ReactElement {
  return (
    <div
      className={cn('flex flex-col gap-4', className)}
      data-slot="record-preview-body"
    >
      {children}
    </div>
  )
}
