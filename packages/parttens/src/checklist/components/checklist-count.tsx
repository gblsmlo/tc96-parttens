import type { ReactElement } from 'react'
import { checklistProgressLabel } from '../lib/progress-label'
import { CHECKLIST_COUNT_CLASSNAME } from '../lib/variants'

const ringRadius = 5
const ringCircumference = 2 * Math.PI * ringRadius

export function ChecklistCount({
  completed,
  meter = false,
  total,
}: Readonly<{
  completed: number
  meter?: boolean
  total: number
}>): ReactElement {
  const label = checklistProgressLabel(completed, total)

  return (
    <span
      aria-label={meter ? label : undefined}
      aria-valuemax={meter ? total : undefined}
      aria-valuemin={meter ? 0 : undefined}
      aria-valuenow={meter ? completed : undefined}
      className={CHECKLIST_COUNT_CLASSNAME}
      data-slot="checklist-count"
      role={meter ? 'progressbar' : undefined}
    >
      <svg
        aria-hidden="true"
        className="-rotate-90 size-3.5 shrink-0"
        data-slot="checklist-count-ring"
        viewBox="0 0 14 14"
      >
        <circle
          className="stroke-muted-foreground/30"
          cx="7"
          cy="7"
          fill="none"
          r={ringRadius}
          strokeWidth="2"
        />
        <circle
          className="stroke-primary"
          cx="7"
          cy="7"
          fill="none"
          r={ringRadius}
          strokeDasharray={ringCircumference}
          strokeDashoffset={ringCircumference * (1 - completed / total)}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <span aria-hidden="true">{`${completed}/${total}`}</span>
      {meter ? null : <span className="sr-only">{label}</span>}
    </span>
  )
}
