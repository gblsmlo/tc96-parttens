import {
  CheckCircleIcon,
  CircleNotchIcon,
  StopCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { RunState } from './use-assistant-run'

export function StepTrace({
  label,
  run,
}: Readonly<{ label: string; run: RunState }>): ReactElement | null {
  if (run.steps.length === 0) return null
  const lastIndex = run.steps.length - 1
  return (
    <ol
      aria-label={label}
      className="flex flex-col gap-1.5 text-sm"
      data-slot="step-trace"
    >
      {run.steps.map((step, index) => {
        const state =
          index < lastIndex || run.status === 'done'
            ? 'done'
            : run.status === 'running'
              ? 'active'
              : 'stopped'
        return (
          <li
            className={cn(
              'flex items-center gap-2',
              state === 'active' ? 'text-foreground' : 'text-muted-foreground',
            )}
            data-kind={step.kind}
            data-slot="step-trace-item"
            data-state={state}
            key={step.id}
          >
            {state === 'done' ? (
              <CheckCircleIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-success-foreground"
              />
            ) : state === 'active' ? (
              <CircleNotchIcon
                aria-hidden="true"
                className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
              />
            ) : (
              <StopCircleIcon aria-hidden="true" className="size-4 shrink-0" />
            )}
            <span>{step.text}</span>
          </li>
        )
      })}
    </ol>
  )
}
