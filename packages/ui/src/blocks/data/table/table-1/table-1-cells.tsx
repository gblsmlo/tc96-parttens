import {
  CreditCardIcon,
  DatabaseIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { getInitials } from '@tc96/ui/helpers/initials'
import { cn } from '@tc96/utils'
import type { ComponentType } from 'react'
import type {
  Table1Labels,
  Table1Priority,
  Table1Queue,
  Table1Sla,
  Table1SlaTone,
  Table1Status,
  Table1Ticket,
} from './types'

const queueIcons = {
  authentication: ShieldCheckIcon,
  billing: CreditCardIcon,
  integrations: PuzzlePieceIcon,
  platform: DatabaseIcon,
} as const satisfies Record<
  Table1Queue,
  ComponentType<{ 'aria-hidden'?: 'true' }>
>

const queueTones = {
  authentication: 'text-info-foreground',
  billing: 'text-warning-foreground',
  integrations: 'text-success-foreground',
  platform: 'text-muted-foreground',
} as const satisfies Record<Table1Queue, string>

const priorityDots = {
  high: 'bg-warning',
  low: 'bg-muted-foreground',
  medium: 'bg-info',
  urgent: 'bg-destructive',
} as const satisfies Record<Table1Priority, string>

export const table1PriorityRank = {
  high: 2,
  low: 0,
  medium: 1,
  urgent: 3,
} as const satisfies Record<Table1Priority, number>

const slaTones = {
  breached:
    'text-destructive-foreground in-data-[state=selected]:text-foreground',
  closed: 'text-muted-foreground in-data-[state=selected]:text-foreground',
  healthy: 'text-success-foreground in-data-[state=selected]:text-foreground',
  warning: 'text-warning-foreground in-data-[state=selected]:text-foreground',
} as const satisfies Record<Table1SlaTone, string>

const statusDots = {
  open: 'bg-info',
  pending: 'bg-warning',
  resolved: 'bg-success',
} as const satisfies Record<Table1Status, string>

export function TicketCell({ ticket }: Readonly<{ ticket: Table1Ticket }>) {
  return (
    <span className="grid min-w-0">
      <span className="truncate font-medium">{ticket.title}</span>
      <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <span className="tabular-nums">{ticket.code}</span>
        <span aria-hidden="true">·</span>
        <span className="truncate">{ticket.opened}</span>
      </span>
    </span>
  )
}

export function RequesterCell({ ticket }: Readonly<{ ticket: Table1Ticket }>) {
  const { requester } = ticket

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar className="size-7">
        {requester.imageUrl ? (
          <AvatarImage alt="" src={requester.imageUrl} />
        ) : null}
        <AvatarFallback className="text-xs">
          {getInitials(requester.name)}
        </AvatarFallback>
      </Avatar>
      <span className="grid min-w-0">
        <span className="truncate font-medium">{requester.name}</span>
        <span className="truncate text-muted-foreground text-xs">
          {requester.company}
        </span>
      </span>
    </div>
  )
}

export function QueueCell({
  labels,
  queue,
}: Readonly<{ labels: Table1Labels; queue: Table1Queue }>) {
  const Icon = queueIcons[queue]

  return (
    <Badge data-queue={queue} variant="outline">
      <Icon aria-hidden="true" className={queueTones[queue]} />
      {labels.queues[queue]}
    </Badge>
  )
}

export function PriorityCell({
  labels,
  priority,
}: Readonly<{ labels: Table1Labels; priority: Table1Priority }>) {
  return (
    <Badge data-priority={priority} variant="outline">
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', priorityDots[priority])}
      />
      {labels.priorities[priority]}
    </Badge>
  )
}

export function SlaCell({ sla }: Readonly<{ sla: Table1Sla }>) {
  return (
    <span className="grid min-w-0">
      <span
        className={cn('truncate font-medium', slaTones[sla.tone])}
        data-sla={sla.tone}
      >
        {sla.label}
      </span>
      <span className="truncate text-muted-foreground text-xs">
        {sla.caption}
      </span>
    </span>
  )
}

export function StatusCell({
  labels,
  status,
}: Readonly<{ labels: Table1Labels; status: Table1Status }>) {
  return (
    <Badge data-status={status} variant="outline">
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', statusDots[status])}
      />
      {labels.statuses[status]}
    </Badge>
  )
}
