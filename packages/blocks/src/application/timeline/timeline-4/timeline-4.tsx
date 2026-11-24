import { getInitials } from '@tc96/helpers/initials'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from '@tc96/ui/sheet'
import type { ReactNode } from 'react'
import { TimelineItem } from '../shared/timeline-item'
import { TimelineList } from '../shared/timeline-list'
import { defaultTimeline4Labels } from './labels'
import { Timeline4Skeleton } from './timeline-4-skeleton'
import type { Timeline4Props } from './types'

export function Timeline4({
  className,
  entries,
  error = false,
  labels: labelsProp,
  onOpenChange,
  onRetry,
  open,
  pending = false,
}: Readonly<Timeline4Props>) {
  const labels = { ...defaultTimeline4Labels, ...labelsProp }

  let body: ReactNode
  if (pending) {
    body = <Timeline4Skeleton label={labels.loading} />
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
  } else if (entries.length === 0) {
    body = (
      <StateSurface
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )
  } else {
    body = (
      <TimelineList label={labels.feed}>
        {entries.map((entry, index) => (
          <TimelineItem
            key={entry.id}
            last={index === entries.length - 1}
            marker={
              <Avatar>
                {entry.actor.image ? (
                  <AvatarImage alt={entry.actor.name} src={entry.actor.image} />
                ) : null}
                <AvatarFallback>{getInitials(entry.actor.name)}</AvatarFallback>
              </Avatar>
            }
          >
            <div className="grid gap-1" data-entry={entry.id}>
              <span className="text-sm">{entry.title}</span>
              <span className="text-muted-foreground text-xs">
                {entry.time}
              </span>
              {entry.badge ? (
                <Badge
                  className="mt-1 w-fit"
                  variant={entry.badge.tone ?? 'secondary'}
                >
                  {entry.badge.label}
                </Badge>
              ) : null}
            </div>
          </TimelineItem>
        ))}
      </TimelineList>
    )
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger render={<Button className={className} size="sm" />}>
        {labels.trigger}
      </SheetTrigger>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>{labels.title}</SheetTitle>
          <SheetDescription>{labels.description}</SheetDescription>
        </SheetHeader>
        <SheetPanel>{body}</SheetPanel>
      </SheetPopup>
    </Sheet>
  )
}
