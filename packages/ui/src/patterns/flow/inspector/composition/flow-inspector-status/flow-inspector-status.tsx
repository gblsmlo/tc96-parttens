'use client'

import { Badge } from '@tc96/ui/badge'
import { cn } from '@tc96/utils'
import type { FlowRunStatus } from '../../../canvas/core'
import { StatGrid, type StatGridItem } from '../../components/stat-grid'
import { StatusIcon } from '../../components/status-icon'
import {
  type FlowStepStats,
  flowStepAbandonment,
  formatFlowDuration,
} from '../../core'
import { flowStatusBadgeVariant } from '../../lib/variants'
import { useFlowInspectorLabels } from '../../store/flow-inspector-context'
import type { FlowInspectorLabels } from '../../types'

export interface FlowInspectorStatusProps {
  className?: string
  durationMs?: number
  labels?: Partial<FlowInspectorLabels>
  runId?: string
  stats?: FlowStepStats
  status?: FlowRunStatus
}

export function FlowInspectorStatus({
  className,
  durationMs,
  labels: labelOverrides,
  runId,
  stats,
  status,
}: FlowInspectorStatusProps) {
  const labels = useFlowInspectorLabels(labelOverrides)
  const duration = formatFlowDuration(durationMs)
  const abandonment = stats ? flowStepAbandonment(stats) : null
  const reached = Boolean(status && status !== 'not-run' && status !== 'idle')

  const lastRun: StatGridItem[] = []
  if (status)
    lastRun.push({
      label: labels.state,
      value: (
        <Badge variant={flowStatusBadgeVariant[status]}>
          <StatusIcon status={status} />
          {labels.statuses[status]}
        </Badge>
      ),
    })
  if (duration) lastRun.push({ label: labels.duration, value: duration })
  if (runId) lastRun.push({ label: labels.run, value: runId })

  const testRuns: StatGridItem[] = []
  if (stats) {
    testRuns.push(
      { label: labels.entered, value: stats.entered },
      { label: labels.completed, value: stats.completed },
      {
        label: labels.abandonment,
        value: abandonment === null ? labels.empty : `${abandonment}%`,
      },
    )
  }

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      data-slot="flow-inspector-status"
    >
      {lastRun.length ? (
        <StatGrid items={lastRun} label={labels.lastRun} />
      ) : null}
      {testRuns.length ? (
        <StatGrid items={testRuns} label={labels.testRuns} />
      ) : null}
      {!reached && !stats?.entered ? (
        <p
          className="text-muted-foreground text-sm"
          data-slot="flow-inspector-status-note"
        >
          {labels.noRunNote}
        </p>
      ) : null}
    </div>
  )
}
