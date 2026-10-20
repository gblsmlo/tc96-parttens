import { Card } from '@tc96/ui/card'
import { Meter, MeterIndicator, MeterTrack } from '@tc96/ui/meter'
import { cn } from '@tc96/utils'
import { type ReactElement, useId } from 'react'
import type { RecordGroupMetricProps } from '../../core'
import { clampMetricProgress } from '../../lib/metric-progress'
import { recordGroupMetricShellClassName } from '../../lib/variants'

export function RecordGroupMetric({
  className,
  icon,
  label,
  progress,
  target,
  value,
}: Readonly<RecordGroupMetricProps>): ReactElement {
  const labelId = `record-group-metric-label-${useId()}`

  return (
    <dl className={cn('min-w-0', className)} data-slot="record-group-metric">
      <Card className={recordGroupMetricShellClassName}>
        <dt className="flex min-w-0 items-center justify-between gap-2 text-muted-foreground text-sm">
          <span className="min-w-0 truncate" id={labelId}>
            {label}
          </span>
          {icon ? (
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center [&_svg]:size-4"
            >
              {icon}
            </span>
          ) : null}
        </dt>
        <dd
          className="flex min-w-0 flex-wrap items-baseline gap-x-1"
          data-slot="record-group-metric-value"
        >
          <span className="font-medium text-lg tabular-nums">{value}</span>
          {target ? (
            <span
              className="text-muted-foreground text-sm tabular-nums"
              data-slot="record-group-metric-target"
            >
              {target}
            </span>
          ) : null}
        </dd>
        {progress === undefined ? null : (
          <dd data-slot="record-group-metric-progress">
            <Meter
              aria-labelledby={labelId}
              max={100}
              min={0}
              value={clampMetricProgress(progress) * 100}
            >
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
          </dd>
        )}
      </Card>
    </dl>
  )
}
