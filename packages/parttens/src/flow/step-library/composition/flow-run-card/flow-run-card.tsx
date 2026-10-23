'use client'

import { IconFrame } from '@tc96/elements/icon-frame'
import { Badge, type BadgeProps } from '@tc96/ui/badge'
import { Card, CardPanel } from '@tc96/ui/card'
import { Progress } from '@tc96/ui/progress'
import { cn } from '@tc96/utils'
import { HistoryIcon } from 'lucide-react'
import { type ReactElement, useId } from 'react'
import type { FlowRunStatus } from '../../../canvas/core'
import { defaultFlowRunCardLabels } from '../../core'
import {
  flowRunCardBodyClassName,
  flowRunCardDescriptionClassName,
  flowRunCardTextClassName,
} from '../../lib/variants'
import type { FlowRunCardProps } from '../../types'

const statusBadges: Record<FlowRunStatus, BadgeProps['variant']> = {
  failed: 'destructive',
  idle: 'outline',
  'not-run': 'outline',
  running: 'info',
  skipped: 'outline',
  success: 'success',
}

export function FlowRunCard({
  className,
  icon,
  labels,
  run,
}: Readonly<FlowRunCardProps>): ReactElement {
  const text = {
    ...defaultFlowRunCardLabels,
    ...labels,
    statuses: { ...defaultFlowRunCardLabels.statuses, ...labels?.statuses },
  }
  const titleId = useId()
  const percent = run.total ? Math.round((run.completed / run.total) * 100) : 0
  const summary = text.summary
    .replace('{completed}', String(run.completed))
    .replace('{total}', String(run.total))

  return (
    <Card
      aria-labelledby={titleId}
      className={cn('shrink-0', className)}
      data-slot="flow-run-card"
      data-status={run.status}
      role="region"
    >
      <CardPanel className={flowRunCardBodyClassName}>
        <div className="flex items-start gap-3">
          <IconFrame>{icon ?? <HistoryIcon />}</IconFrame>
          <div className={flowRunCardTextClassName}>
            <h3 className="font-medium text-sm" id={titleId}>
              {text.title}
            </h3>
            <p className={flowRunCardDescriptionClassName}>
              {run.note ?? summary}
            </p>
          </div>
          <Badge variant={statusBadges[run.status]}>
            {text.statuses[run.status]}
          </Badge>
        </div>
        <Progress aria-label={`${text.title}: ${percent}%`} value={percent} />
      </CardPanel>
    </Card>
  )
}
