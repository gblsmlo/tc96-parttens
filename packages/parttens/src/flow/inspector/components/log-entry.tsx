import type { FlowLogEntry } from '../core'
import { useFlowInspectorLabels } from '../store/flow-inspector-context'
import { StatusIcon } from './status-icon'

export function LogEntry({ entry }: Readonly<{ entry: FlowLogEntry }>) {
  const labels = useFlowInspectorLabels()
  return (
    <li
      className="flex gap-2.5 px-4 py-3"
      data-slot="flow-inspector-log-entry"
      data-status={entry.status}
    >
      <span
        className="mt-0.5 inline-flex"
        role="img"
        aria-label={labels.statuses[entry.status]}
      >
        <StatusIcon status={entry.status} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="flex items-baseline gap-1.5 text-sm">
          <span className="min-w-0 truncate font-medium">{entry.stepName}</span>
          <span className="shrink-0 text-muted-foreground text-xs">
            #{entry.sequence}
          </span>
        </p>
        {entry.description ? (
          <p className="break-words text-muted-foreground text-xs">
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}
