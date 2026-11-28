'use client'

import { PlusIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupAction } from '@tc96/ui/patterns/records/group/composition/record-group-action/record-group-action'
import { RecordGroupLink } from '@tc96/ui/patterns/records/group/composition/record-group-link/record-group-link'
import { useMemo } from 'react'
import { resolveRecordGroup11Labels } from './labels'
import type { RecordGroup11Props } from './types'

function formatAge(
  updatedAt: string,
  now: Date,
  formatter: Intl.RelativeTimeFormat,
  justNow: string,
): string {
  const minutes = Math.round((Date.parse(updatedAt) - now.getTime()) / 60_000)
  if (minutes > -1) return justNow
  if (minutes > -60) return formatter.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours > -24) return formatter.format(hours, 'hour')
  return formatter.format(Math.round(hours / 24), 'day')
}

export function RecordGroup11({
  className,
  labels: labelsProp,
  locale = 'en-US',
  notes,
  now,
  onCreate,
  onOpenNote,
  onViewAll,
}: Readonly<RecordGroup11Props>) {
  const labels = useMemo(
    () => resolveRecordGroup11Labels(labelsProp),
    [labelsProp],
  )
  const formatter = useMemo(
    () => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
    [locale],
  )
  const reference = now ?? new Date()

  return (
    <RecordGroup
      actions={
        onViewAll || onCreate ? (
          <>
            {onViewAll ? (
              <Button onClick={onViewAll} size="xs" variant="ghost">
                {labels.viewAll}
              </Button>
            ) : null}
            {onCreate ? (
              <RecordGroupAction
                icon={PlusIcon}
                label={labels.create}
                onClick={onCreate}
              />
            ) : null}
          </>
        ) : undefined
      }
      className={className}
      title={
        <span className="inline-flex items-center gap-1.5">
          {labels.title} <Badge variant="outline">{notes.length}</Badge>
        </span>
      }
      variant="inset"
    >
      {notes.map((note) => (
        <RecordGroupLink
          key={note.id}
          leading={
            <Avatar
              aria-hidden
              className="[--avatar-size:--spacing(4)] text-[0.625rem]"
            >
              {note.author.avatarUrl ? (
                <AvatarImage alt="" src={note.author.avatarUrl} />
              ) : null}
              <AvatarFallback>{note.author.initials}</AvatarFallback>
            </Avatar>
          }
          meta={
            <time dateTime={note.updatedAt}>
              {formatAge(note.updatedAt, reference, formatter, labels.justNow)}
            </time>
          }
          onClick={() => onOpenNote(note.id)}
          render={<button type="button" />}
        >
          {note.title.trim() === '' ? labels.untitled : note.title}{' '}
          <span className="text-muted-foreground">
            {note.preview.trim() === '' ? labels.emptyPreview : note.preview}
          </span>
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}
