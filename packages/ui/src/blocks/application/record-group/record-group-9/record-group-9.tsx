'use client'

import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupMetric } from '@tc96/ui/patterns/records/group/composition/record-group-metric/record-group-metric'
import { RecordGroupMetrics } from '@tc96/ui/patterns/records/group/composition/record-group-metrics/record-group-metrics'
import { useMemo } from 'react'
import { resolveRecordGroup9Labels } from './labels'
import type { RecordGroup9Props } from './types'

export function RecordGroup9({
  className,
  labels: labelsProp,
  metrics,
}: Readonly<RecordGroup9Props>) {
  const labels = useMemo(
    () => resolveRecordGroup9Labels(labelsProp),
    [labelsProp],
  )

  return (
    <RecordGroup className={className} title={labels.title} variant="plain">
      <RecordGroupMetrics columns={2}>
        {metrics.map(
          ({ icon: MetricIcon, id, label, progress, target, value }) => (
            <RecordGroupMetric
              icon={MetricIcon ? <MetricIcon aria-hidden /> : undefined}
              key={id}
              label={label}
              progress={progress ? progress.value / progress.max : undefined}
              target={target}
              value={value}
            />
          ),
        )}
      </RecordGroupMetrics>
    </RecordGroup>
  )
}
