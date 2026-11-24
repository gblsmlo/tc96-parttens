import { VideoCameraIcon } from '@phosphor-icons/react'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { AvatarStack } from '@tc96/parttens/widgets/shared/avatar-stack'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardFooter,
  CardFrame,
  CardFrameAction,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from '@tc96/ui/card'
import { Separator } from '@tc96/ui/separator'
import { useId } from 'react'
import { CardBadge } from '../shared/card-badge'
import { cardLoadState } from '../shared/card-load-state'
import { CardMenu } from '../shared/card-menu'
import { Card8Skeleton } from './card-8-skeleton'
import { defaultCard8Labels } from './labels'
import type { Card8Labels, Card8Meeting, Card8Props } from './types'

interface MeetingCardProps {
  actions: Card8Props['actions']
  labels: Card8Labels
  meeting: Card8Meeting
  onActionSelect?: Card8Props['onActionSelect']
  onJoin?: Card8Props['onJoin']
}

function MeetingCard({
  actions,
  labels,
  meeting,
  onActionSelect,
  onJoin,
}: Readonly<MeetingCardProps>) {
  const titleId = useId()

  return (
    <CardFrame
      aria-labelledby={titleId}
      data-meeting={meeting.id}
      render={<section />}
    >
      <CardFrameHeader>
        <CardFrameTitle>{labels.heading}</CardFrameTitle>
        {actions?.length && onActionSelect ? (
          <CardFrameAction>
            <CardMenu
              actions={actions}
              label={labels.more(meeting.title)}
              onSelect={(actionId) => onActionSelect(meeting.id, actionId)}
            />
          </CardFrameAction>
        ) : null}
      </CardFrameHeader>
      <Card>
        <CardPanel className="grid gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="grid min-w-0 gap-0.5">
              <h3 className="truncate font-medium" id={titleId}>
                {meeting.title}
              </h3>
              <p className="text-muted-foreground text-sm">{meeting.time}</p>
            </div>
            <Badge variant="secondary">{meeting.duration}</Badge>
          </div>
          {meeting.description ? (
            <p className="text-muted-foreground text-sm">
              {meeting.description}
            </p>
          ) : null}
          {meeting.people?.length || meeting.tag ? (
            <div className="flex flex-wrap items-center gap-2">
              {meeting.people?.length ? (
                <AvatarStack
                  aria-label={labels.people}
                  people={meeting.people}
                  size="sm"
                />
              ) : null}
              {meeting.tag ? <CardBadge {...meeting.tag} /> : null}
            </div>
          ) : null}
        </CardPanel>
        {onJoin ? (
          <>
            <Separator />
            <CardFooter className="px-5 py-3">
              <Button
                aria-label={labels.joinTo(meeting.title)}
                onClick={() => onJoin(meeting.id)}
                size="sm"
                variant="ghost"
              >
                {meeting.providerIcon ?? <VideoCameraIcon />}
                {labels.join}
              </Button>
            </CardFooter>
          </>
        ) : null}
      </Card>
    </CardFrame>
  )
}

export function Card8({
  actions,
  className,
  error,
  labels: labelsProp,
  meetings,
  onActionSelect,
  onJoin,
  onRetry,
  pending,
}: Readonly<Card8Props>) {
  const labels = { ...defaultCard8Labels, ...labelsProp }
  const loadState = cardLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Card8Skeleton label={labels.loading} />,
  })

  if (loadState)
    return (
      <section aria-label={labels.title} className={className}>
        {loadState}
      </section>
    )

  if (meetings.length === 0)
    return (
      <StateSurface
        className={className}
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )

  return (
    <section aria-label={labels.title} className={className}>
      <ul className="grid list-none gap-4 md:grid-cols-2">
        {meetings.map((meeting) => (
          <li className="min-w-0" key={meeting.id}>
            <MeetingCard
              actions={actions}
              labels={labels}
              meeting={meeting}
              onActionSelect={onActionSelect}
              onJoin={onJoin}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
