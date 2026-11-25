import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { getInitials } from '@tc96/ui/helpers/initials'
import { cn } from '@tc96/utils'
import type { Support2Sla, Support2SlaTone, Support2Ticket } from './types'

const slaTones = {
  breached:
    'text-destructive-foreground in-data-[state=selected]:text-foreground',
  closed: 'text-muted-foreground in-data-[state=selected]:text-foreground',
  healthy: 'text-success-foreground in-data-[state=selected]:text-foreground',
  warning: 'text-warning-foreground in-data-[state=selected]:text-foreground',
} as const satisfies Record<Support2SlaTone, string>

export function TicketCell({ ticket }: Readonly<{ ticket: Support2Ticket }>) {
  return (
    <span className="grid min-w-0 gap-0.5">
      <span className="truncate font-medium">{ticket.title}</span>
      <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <span className="tabular-nums">{ticket.code}</span>
        <span aria-hidden="true">·</span>
        <span className="truncate">{ticket.opened}</span>
      </span>
    </span>
  )
}

export function RequesterCell({
  ticket,
}: Readonly<{ ticket: Support2Ticket }>) {
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
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate font-medium">{requester.name}</span>
        <span className="truncate text-muted-foreground text-xs">
          {requester.company}
        </span>
      </span>
    </div>
  )
}

export function SlaCell({ sla }: Readonly<{ sla: Support2Sla }>) {
  return (
    <span className="grid min-w-0 gap-0.5">
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
