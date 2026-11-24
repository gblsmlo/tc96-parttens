import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { defaultTimeline3Labels } from './labels'
import { Timeline3Skeleton } from './timeline-3-skeleton'
import type { Timeline3Props, Timeline3Status } from './types'

const statusVariants = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
} as const satisfies Record<Timeline3Status, string>

export function Timeline3({
  className,
  currentStepId,
  error = false,
  labels: labelsProp,
  onApprove,
  onReject,
  onRetry,
  pending = false,
  steps,
}: Readonly<Timeline3Props>) {
  const labels = { ...defaultTimeline3Labels, ...labelsProp }

  let body: ReactNode
  if (pending) {
    body = <Timeline3Skeleton label={labels.loading} />
  } else if (error) {
    body = (
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
    )
  } else if (steps.length === 0) {
    body = (
      <StateSurface
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )
  } else {
    body = (
      <ScrollArea>
        <ol
          aria-label={labels.title}
          className="m-0 flex w-max list-none items-start p-0 pb-3"
        >
          {steps.map((step, index) => {
            const current = step.id === currentStepId
            return (
              <li
                aria-current={current ? 'step' : undefined}
                className="flex items-start"
                data-current={current ? '' : undefined}
                data-step={step.id}
                key={step.id}
              >
                <div
                  className={cn(
                    'grid w-64 gap-3 rounded-xl border bg-card p-4 text-card-foreground',
                    current && 'border-primary ring-1 ring-primary',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Avatar>
                      {step.owner.image ? (
                        <AvatarImage
                          alt={step.owner.name}
                          src={step.owner.image}
                        />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(step.owner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">{step.owner.name}</span>
                  </div>
                  <div className="grid gap-1">
                    <span className="font-medium text-sm">{step.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {step.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariants[step.status]}>
                      {labels.statuses[step.status]}
                    </Badge>
                    {current ? (
                      <span className="font-medium text-primary text-xs">
                        {labels.currentStep}
                      </span>
                    ) : null}
                  </div>
                  {current ? (
                    <div className="flex gap-2">
                      <Button onClick={() => onApprove?.(step.id)} size="sm">
                        {labels.approve}
                      </Button>
                      <Button
                        onClick={() => onReject?.(step.id)}
                        size="sm"
                        variant="outline"
                      >
                        {labels.reject}
                      </Button>
                    </div>
                  ) : null}
                </div>
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mt-8 h-px w-6 shrink-0 bg-border"
                    data-slot="timeline-3-connector"
                  />
                ) : null}
              </li>
            )
          })}
        </ol>
      </ScrollArea>
    )
  }

  return (
    <section
      aria-label={labels.title}
      className={cn('grid grid-cols-[minmax(0,1fr)] gap-3', className)}
    >
      <h3 className="font-medium text-base">{labels.title}</h3>
      {body}
    </section>
  )
}
