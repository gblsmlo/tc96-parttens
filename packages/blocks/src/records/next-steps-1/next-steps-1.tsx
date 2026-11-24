'use client'

import { RecordGroup } from '@tc96/parttens/records/group/composition/record-group/record-group'
import { RecordGroupItem } from '@tc96/parttens/records/group/composition/record-group-item/record-group-item'
import { Button } from '@tc96/ui/button'
import type { ReactElement } from 'react'
import { resolveRecordsLabels } from '../shared/labels'
import { StatusRows } from '../shared/status-rows'
import { defaultNextSteps1Labels } from './labels'
import type { NextSteps1Props } from './types'

export function NextSteps1({
  className,
  labels: labelsProp,
  onDismiss,
  onTask,
  rows,
  tasks = [],
}: Readonly<NextSteps1Props>): ReactElement {
  const labels = resolveRecordsLabels(defaultNextSteps1Labels, labelsProp)

  return (
    <RecordGroup
      actions={
        onDismiss ? (
          <Button onClick={onDismiss} size="sm" type="button" variant="ghost">
            {labels.dismiss}
          </Button>
        ) : undefined
      }
      className={className}
      collapsible={false}
      title={labels.title}
      variant="card"
    >
      <div className="flex flex-col gap-3" data-slot="next-steps">
        {rows.length > 0 ? (
          <StatusRows label={labels.progress} rows={rows} />
        ) : null}
        {tasks.length > 0 ? (
          <div data-slot="next-steps-tasks">
            {tasks.map((task) => (
              <RecordGroupItem key={task.id} title={task.title}>
                <Button
                  onClick={() => onTask?.(task.id)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {task.actionLabel}
                </Button>
              </RecordGroupItem>
            ))}
          </div>
        ) : null}
      </div>
    </RecordGroup>
  )
}
