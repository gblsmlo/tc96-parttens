import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { RecordGroupMetricsProps } from '../../core'
import { recordGroupMetricsVariants } from '../../lib/variants'

export function RecordGroupMetrics({
  children,
  className,
  columns = 2,
}: Readonly<RecordGroupMetricsProps>): ReactElement {
  return (
    <div
      className={cn(recordGroupMetricsVariants({ columns }), className)}
      data-slot="record-group-metrics"
    >
      {children}
    </div>
  )
}
