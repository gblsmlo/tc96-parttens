'use client'

import { Text } from '@tc96/elements/text'
import type { ReactElement, ReactNode } from 'react'

export function ChecklistHeader({
  completed,
  progress,
  title,
  total,
}: Readonly<{
  completed: number
  progress: boolean
  title: ReactNode
  total: number
}>): ReactElement | null {
  const progressLabel = `${completed} de ${total} ${total === 1 ? 'concluído' : 'concluídos'}`

  if (total === 0) {
    if (title == null) return null
    return (
      <div
        className="flex items-center justify-between gap-3"
        data-slot="checklist-header"
      >
        <Text size="sm" weight="medium">
          {title}
        </Text>
      </div>
    )
  }

  if (title == null && !progress) return null

  return (
    <div data-slot="progress">
      {title == null ? null : (
        <div
          className="flex items-center justify-between gap-3"
          data-slot="checklist-header"
        >
          <Text size="sm" weight="medium">
            {title}
          </Text>
          <span className="text-muted-foreground text-sm tabular-nums">
            {progressLabel}
          </span>
        </div>
      )}
      {progress ? (
        <div
          aria-label={progressLabel}
          aria-valuemax={total}
          aria-valuemin={0}
          aria-valuenow={completed}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          data-slot="progress-track"
          role="progressbar"
        >
          <div
            className="h-full bg-primary"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}
