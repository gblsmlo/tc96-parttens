import { PaperclipIcon } from '@phosphor-icons/react'
import { getInitials } from '@tc96/helpers/initials'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { cn } from '@tc96/utils'
import { TimelineError } from '../shared/timeline-error'
import { TimelineItem } from '../shared/timeline-item'
import { TimelineList } from '../shared/timeline-list'
import { defaultTimeline1Labels } from './labels'
import { Timeline1Skeleton } from './timeline-1-skeleton'
import type { Timeline1Props } from './types'

export function Timeline1({
  className,
  error = false,
  events,
  labels: labelsProp,
  onRetry,
  pending = false,
}: Readonly<Timeline1Props>) {
  const labels = { ...defaultTimeline1Labels, ...labelsProp }

  if (pending) {
    return (
      <Timeline1Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  return (
    <section aria-label={labels.title} className={cn('grid gap-4', className)}>
      <h3 className="font-medium text-base">{labels.title}</h3>
      {error ? (
        <TimelineError
          description={labels.errorDescription}
          onRetry={onRetry}
          retry={labels.retry}
          title={labels.errorTitle}
        />
      ) : events.length === 0 ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <TimelineList label={labels.title}>
          {events.map((event, index) => (
            <TimelineItem
              key={event.id}
              last={index === events.length - 1}
              marker={
                <Avatar className="size-8">
                  {event.avatarSrc ? (
                    <AvatarImage alt="" src={event.avatarSrc} />
                  ) : null}
                  <AvatarFallback>{getInitials(event.actor)}</AvatarFallback>
                </Avatar>
              }
            >
              <div className="grid gap-2 pt-1" data-event={event.id}>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
                  <span className="font-medium">{event.actor}</span>
                  <span className="text-muted-foreground">{event.action}</span>
                  {event.status ? (
                    <Badge variant={event.status.tone ?? 'secondary'}>
                      {event.status.label}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-xs">{event.time}</p>
                {event.attachments?.length ? (
                  <ul
                    aria-label={labels.attachments}
                    className="m-0 flex list-none flex-wrap gap-1.5 p-0"
                  >
                    {event.attachments.map((attachment) => (
                      <li key={attachment.id}>
                        <Badge variant="outline">
                          <PaperclipIcon aria-hidden="true" />
                          {attachment.label}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </TimelineItem>
          ))}
        </TimelineList>
      )}
    </section>
  )
}
