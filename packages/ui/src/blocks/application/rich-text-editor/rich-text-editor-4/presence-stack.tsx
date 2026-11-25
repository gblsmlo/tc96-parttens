'use client'

import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { richTextEditor4Colors } from './colors'
import type {
  RichTextEditor4Labels,
  RichTextEditor4Status,
  RichTextEditor4User,
} from './types'

export interface PresenceEntry {
  id: string
  name: string
  status: RichTextEditor4Status
  user: RichTextEditor4User
}

const statusDot = {
  editing: 'bg-success',
  idle: 'bg-muted-foreground',
  viewing: 'bg-info',
} as const satisfies Record<RichTextEditor4Status, string>

function Face({ entry }: Readonly<{ entry: PresenceEntry }>): ReactElement {
  const palette = richTextEditor4Colors[entry.user.color]
  return (
    <span
      className={cn(
        'relative inline-flex rounded-full ring-2 ring-offset-2 ring-offset-background',
        palette.ring,
      )}
    >
      <Avatar className="[--avatar-size:--spacing(7)]">
        <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
      </Avatar>
      <span
        className={cn(
          'absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-background',
          statusDot[entry.status],
        )}
        data-status={entry.status}
        data-slot="presence-status"
      />
    </span>
  )
}

export function PresenceStack({
  followId,
  labels,
  onFollow,
  others,
  self,
}: Readonly<{
  followId: string | null
  labels: RichTextEditor4Labels['presence']
  onFollow: (id: string | null) => void
  others: PresenceEntry[]
  self: PresenceEntry
}>): ReactElement {
  const everyone = [self, ...others]
  const counts: Record<RichTextEditor4Status, number> = {
    editing: 0,
    idle: 0,
    viewing: 0,
  }
  for (const entry of everyone) counts[entry.status] += 1
  const followed = others.find((entry) => entry.id === followId)
  return (
    <div
      className="flex flex-wrap items-center gap-3"
      data-slot="presence-stack"
    >
      <ul aria-label={labels.group} className="flex items-center gap-2.5">
        <li data-person={self.id}>
          <span
            aria-label={labels.person(labels.you, labels.status[self.status])}
            role="img"
          >
            <Face entry={self} />
          </span>
        </li>
        {others.map((entry) => (
          <li data-person={entry.id} key={entry.id}>
            <button
              aria-label={labels.person(
                entry.name,
                labels.status[entry.status],
              )}
              aria-pressed={followId === entry.id}
              className="inline-flex rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onFollow(followId === entry.id ? null : entry.id)}
              title={labels.follow(entry.name)}
              type="button"
            >
              <Face entry={entry} />
            </button>
          </li>
        ))}
      </ul>
      <output
        className="text-muted-foreground text-xs"
        data-slot="presence-summary"
      >
        {labels.summary(counts)}
      </output>
      {followed ? (
        <Button onClick={() => onFollow(null)} size="sm" variant="outline">
          {labels.following(followed.name)}
          <span className="sr-only">. {labels.stopFollowing}</span>
        </Button>
      ) : null}
    </div>
  )
}
