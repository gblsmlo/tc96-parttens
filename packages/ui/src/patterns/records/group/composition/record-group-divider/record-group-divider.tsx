import { Separator } from '@tc96/ui/separator'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { RecordGroupDividerProps } from '../../core'

export function RecordGroupDivider({
  className,
}: Readonly<RecordGroupDividerProps>): ReactElement {
  return (
    <Separator className={cn('my-1', className)} data-record-group-divider="" />
  )
}
