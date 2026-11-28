'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupItem } from '@tc96/ui/patterns/records/group/composition/record-group-item/record-group-item'
import { useMemo } from 'react'
import { resolveRecordGroup10Labels } from './labels'
import type { RecordGroup10Entry, RecordGroup10Props } from './types'

function EntrySentence({
  actor,
  object,
  preposition,
  subject,
  verb,
}: Readonly<RecordGroup10Entry>) {
  return (
    <>
      {actor.name} <span className="text-muted-foreground">{verb}</span>
      {subject ? <> {subject}</> : null}
      {preposition ? (
        <>
          {' '}
          <span className="text-muted-foreground">{preposition}</span>
        </>
      ) : null}
      {object ? <> {object}</> : null}
    </>
  )
}

export function RecordGroup10({
  className,
  entries,
  labels: labelsProp,
  onViewAll,
}: Readonly<RecordGroup10Props>) {
  const labels = useMemo(
    () => resolveRecordGroup10Labels(labelsProp),
    [labelsProp],
  )

  return (
    <RecordGroup
      actions={
        onViewAll ? (
          <Button onClick={onViewAll} size="xs" variant="ghost">
            {labels.viewAll}
          </Button>
        ) : undefined
      }
      className={className}
      title={labels.title}
      variant="inset"
    >
      {entries.map((entry) => (
        <RecordGroupItem
          key={entry.id}
          leading={
            <Avatar
              aria-hidden
              className="[--avatar-size:--spacing(4)] text-[0.625rem]"
            >
              {entry.actor.avatarUrl ? (
                <AvatarImage alt="" src={entry.actor.avatarUrl} />
              ) : null}
              <AvatarFallback>{entry.actor.initials}</AvatarFallback>
            </Avatar>
          }
          title={<EntrySentence {...entry} />}
        >
          <time className="text-muted-foreground" dateTime={entry.at}>
            {entry.timeLabel}
          </time>
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}
