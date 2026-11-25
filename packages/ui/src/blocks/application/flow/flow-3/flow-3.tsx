'use client'

import { Badge, type BadgeProps } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Card, CardPanel } from '@tc96/ui/card'
import { FlowCanvas } from '@tc96/ui/patterns/flow/canvas/composition/flow-canvas/flow-canvas'
import { FlowCanvasControls } from '@tc96/ui/patterns/flow/canvas/composition/flow-canvas-controls/flow-canvas-controls'
import {
  type FlowConnection,
  type FlowRunStatus,
  type FlowStep,
  flowRunSummary,
  flowStepNodeSize,
  tidyTree,
} from '@tc96/ui/patterns/flow/canvas/core'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Progress } from '@tc96/ui/progress'
import { cn } from '@tc96/utils'
import { type ReactElement, useMemo } from 'react'
import { Flow3Skeleton } from './flow-3-skeleton'
import { defaultFlow3Labels } from './labels'
import type { Flow3Props, Flow3Status, Flow3Step } from './types'

const flowStatuses: Record<Flow3Status, FlowRunStatus> = {
  failed: 'failed',
  pending: 'not-run',
  running: 'running',
  succeeded: 'success',
  'waiting-approval': 'idle',
}

const summaryBadges: Record<FlowRunStatus, BadgeProps['variant']> = {
  failed: 'error',
  idle: 'warning',
  'not-run': 'secondary',
  running: 'info',
  skipped: 'secondary',
  success: 'success',
}

const summaryStatuses: Record<FlowRunStatus, Flow3Status> = {
  failed: 'failed',
  idle: 'waiting-approval',
  'not-run': 'pending',
  running: 'running',
  skipped: 'pending',
  success: 'succeeded',
}

function toFlowStep(step: Flow3Step): FlowStep {
  return {
    description: step.description,
    id: step.id,
    name: step.name,
    owner: step.owner ? { name: step.owner } : undefined,
    position: { x: 0, y: 0 },
    run: {
      durationMs: step.durationMs,
      status: flowStatuses[step.status],
    },
    type: 'step',
  }
}

export function Flow3({
  className,
  connections,
  error = false,
  labels: labelsProp,
  onApprove,
  onReject,
  onReplay,
  onRetry,
  pending = false,
  steps,
}: Readonly<Flow3Props>): ReactElement {
  const labels = { ...defaultFlow3Labels, ...labelsProp }
  const flowSteps = useMemo(
    () =>
      tidyTree(steps.map(toFlowStep), connections as FlowConnection[], {
        direction: 'horizontal',
        gap: [96, 48],
        nodeSize: flowStepNodeSize,
      }),
    [steps, connections],
  )
  const summary = useMemo(() => flowRunSummary(flowSteps), [flowSteps])
  const canvasLabels = useMemo(
    () => ({
      canvas: labels.canvas,
      statuses: {
        failed: labels.statuses.failed,
        idle: labels.statuses['waiting-approval'],
        'not-run': labels.statuses.pending,
        running: labels.statuses.running,
        skipped: labels.statuses.pending,
        success: labels.statuses.succeeded,
      },
      stepName: (name: string, _type: string, status: string) =>
        `${name}, ${status}`,
    }),
    [labels.canvas, labels.statuses],
  )

  if (pending) {
    return (
      <Flow3Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const waiting = steps.filter((step) => step.status === 'waiting-approval')
  const percent = summary.total
    ? Math.round((summary.completed / summary.total) * 100)
    : 0

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-slot="flow-3"
    >
      <h3 className="font-medium text-base">{labels.title}</h3>
      {error ? (
        <StateSurface
          actions={
            onRetry ? (
              <Button onClick={onRetry} size="sm" variant="outline">
                {labels.retry}
              </Button>
            ) : undefined
          }
          description={labels.errorDescription}
          kind="error"
          title={labels.errorTitle}
        />
      ) : steps.length === 0 ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="h-96 min-w-0 overflow-hidden rounded-xl border lg:h-136">
            <FlowCanvas
              connections={connections}
              direction="horizontal"
              edgeControls={false}
              labels={canvasLabels}
              locked
              stepMenu={false}
              steps={flowSteps}
            >
              <FlowCanvasControls />
            </FlowCanvas>
          </div>
          <Card data-slot="flow-3-summary">
            <CardPanel className="grid content-start gap-5 p-5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-sm">{labels.summaryTitle}</h4>
                <Badge variant={summaryBadges[summary.status]}>
                  {labels.statuses[summaryStatuses[summary.status]]}
                </Badge>
              </div>
              <div className="grid gap-2">
                <Progress
                  aria-label={labels.summary(summary.completed, summary.total)}
                  value={percent}
                />
                <p className="text-muted-foreground text-xs tabular-nums">
                  {labels.summary(summary.completed, summary.total)}
                </p>
              </div>
              <div className="grid gap-3">
                <h4 className="font-medium text-sm">{labels.approvalsTitle}</h4>
                {waiting.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {labels.noApprovals}
                  </p>
                ) : (
                  <ul className="m-0 grid list-none gap-3 p-0">
                    {waiting.map((step) => (
                      <li
                        className="grid gap-2 rounded-lg border p-3"
                        data-step={step.id}
                        key={step.id}
                      >
                        <span className="font-medium text-sm">{step.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {labels.approvalDescription}
                        </span>
                        {onApprove || onReject ? (
                          <div className="flex gap-2">
                            {onApprove ? (
                              <Button
                                aria-label={labels.approveStep(step.name)}
                                onClick={() => onApprove(step.id)}
                                size="sm"
                              >
                                {labels.approve}
                              </Button>
                            ) : null}
                            {onReject ? (
                              <Button
                                aria-label={labels.rejectStep(step.name)}
                                onClick={() => onReject(step.id)}
                                size="sm"
                                variant="outline"
                              >
                                {labels.reject}
                              </Button>
                            ) : null}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {onReplay ? (
                <Button onClick={onReplay} size="sm" variant="outline">
                  {labels.replay}
                </Button>
              ) : null}
            </CardPanel>
          </Card>
        </div>
      )}
    </section>
  )
}
