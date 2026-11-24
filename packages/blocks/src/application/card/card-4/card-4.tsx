import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { AvatarStack } from '@tc96/parttens/widgets/shared/avatar-stack'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { useId } from 'react'
import { defaultCard4Labels } from './labels'
import type { Card4Labels, Card4Meeting, Card4Props } from './types'

interface MeetingCardProps {
  labels: Card4Labels
  maxAttendees: number
  meeting: Card4Meeting
  onJoin?: Card4Props['onJoin']
}

function MeetingCard({
  labels,
  maxAttendees,
  meeting,
  onJoin,
}: Readonly<MeetingCardProps>) {
  const titleId = useId()

  return (
    <WidgetShell aria-labelledby={titleId} data-meeting={meeting.id}>
      <CardPanel className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <h3 className="truncate font-medium" id={titleId}>
              {meeting.title}
            </h3>
            <p
              className="text-muted-foreground text-sm tabular-nums"
              data-slot="card-4-time"
            >
              {meeting.timeRange}
            </p>
          </div>
          <Badge size="large" variant="secondary">
            {meeting.duration}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-3">
          <AvatarStack
            aria-label={labels.attendees(meeting.title)}
            max={maxAttendees}
            people={meeting.attendees}
            size="sm"
          />
          {onJoin ? (
            <Button
              aria-label={labels.joinMeeting(meeting.title)}
              onClick={() => onJoin(meeting.id)}
              size="sm"
              variant="outline"
            >
              {labels.join}
            </Button>
          ) : null}
        </div>
      </CardPanel>
    </WidgetShell>
  )
}

export function Card4({
  className,
  labels: labelsProp,
  maxAttendees = 4,
  meetings,
  onJoin,
}: Readonly<Card4Props>) {
  const labels = { ...defaultCard4Labels, ...labelsProp }

  if (meetings.length === 0) {
    return (
      <StateSurface
        className={className}
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )
  }

  return (
    <section aria-label={labels.title} className={className}>
      <ul className="grid list-none gap-4 md:grid-cols-2 xl:grid-cols-3">
        {meetings.map((meeting) => (
          <li className="min-w-0" key={meeting.id}>
            <MeetingCard
              labels={labels}
              maxAttendees={maxAttendees}
              meeting={meeting}
              onJoin={onJoin}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
