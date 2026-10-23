'use client'

import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@tc96/ui/empty'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { cn } from '@tc96/utils'
import { LogEntry } from '../../components/log-entry'
import type { FlowLogEntry, FlowLogFilter } from '../../core'
import { useFlowInspectorLabels } from '../../store/flow-inspector-context'
import type { FlowInspectorLabels } from '../../types'

export interface FlowInspectorLogsProps {
  className?: string
  emptyActionLabel?: string
  entries: readonly FlowLogEntry[]
  filter: FlowLogFilter
  labels?: Partial<FlowInspectorLabels>
  onEmptyAction?: () => void
  onFilterChange: (filter: FlowLogFilter) => void
}

export function FlowInspectorLogs({
  className,
  emptyActionLabel,
  entries,
  filter,
  labels: labelOverrides,
  onEmptyAction,
  onFilterChange,
}: FlowInspectorLogsProps) {
  const labels = useFlowInspectorLabels(labelOverrides)

  return (
    <div
      className={cn('flex flex-col gap-3', className)}
      data-slot="flow-inspector-logs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          aria-label={labels.logFilter}
          onValueChange={(value) => {
            const next = value[0]
            if (next === 'step' || next === 'all') onFilterChange(next)
          }}
          size="sm"
          value={[filter]}
          variant="outline"
        >
          <ToggleGroupItem value="step">{labels.logThisStep}</ToggleGroupItem>
          <ToggleGroupItem value="all">{labels.logAllSteps}</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-muted-foreground text-xs">
          {labels.logCount(entries.length)}
        </p>
      </div>
      {entries.length ? (
        <ul
          className="-mx-4 flex flex-col divide-y border-y"
          data-slot="flow-inspector-log-list"
        >
          {entries.map((entry) => (
            <LogEntry entry={entry} key={entry.id} />
          ))}
        </ul>
      ) : (
        <Empty className="py-8 md:py-10" data-slot="flow-inspector-logs-empty">
          <EmptyHeader>
            <EmptyTitle className="text-base">
              {labels.logsEmptyTitle}
            </EmptyTitle>
            <EmptyDescription>{labels.logsEmptyDescription}</EmptyDescription>
          </EmptyHeader>
          {onEmptyAction && emptyActionLabel ? (
            <EmptyContent>
              <Button onClick={onEmptyAction} size="sm" variant="outline">
                {emptyActionLabel}
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      )}
    </div>
  )
}
