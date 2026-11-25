import { IdentificationBadgeIcon, StarIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { getInitials } from '@tc96/ui/helpers/initials'
import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { AvatarStack } from '@tc96/ui/patterns/widgets/shared/avatar-stack'
import { ProgressRing } from '@tc96/ui/patterns/widgets/shared/progress-ring'
import { cn } from '@tc96/utils'
import {
  dataPriorities,
  dataPriorityAppearance,
} from '../../shared/properties/data-priority'
import {
  DataDate,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { TableFormatter } from '../../shared/table/format'
import type {
  Team2ColumnId,
  Team2Labels,
  Team2Member,
  Team2Presence,
} from './types'

const presenceDot = {
  away: 'bg-warning',
  offline: 'bg-muted-foreground',
  online: 'bg-success',
} as const satisfies Record<Team2Presence, string>

const starPositions = [1, 2, 3, 4, 5]

interface ColumnsInput {
  formatter: TableFormatter
  labels: Team2Labels
  locale?: string
}

function PresenceDot({
  className,
  label,
  presence,
}: Readonly<{
  className?: string
  label: string
  presence: Team2Presence
}>) {
  return (
    <span
      className={cn(
        'block size-2.5 rounded-full border-2 border-background',
        presenceDot[presence],
        className,
      )}
      data-presence={presence}
    >
      <span className="sr-only">{label}</span>
    </span>
  )
}

function MemberCell({
  labels,
  member,
}: Readonly<{ labels: Team2Labels; member: Team2Member }>) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="relative shrink-0">
        <Avatar>
          {member.imageUrl ? (
            <AvatarImage alt="" src={member.imageUrl} />
          ) : null}
          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
        </Avatar>
        <PresenceDot
          className="absolute -end-0.5 -bottom-0.5"
          label={labels.presence[member.presence]}
          presence={member.presence}
        />
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span className="flex items-center gap-1 font-medium">
          <span className="truncate">{member.name}</span>
          {member.isCurrentUser ? (
            <span className="shrink-0 font-normal text-muted-foreground">
              {labels.you}
            </span>
          ) : null}
        </span>
        <span className="truncate text-muted-foreground text-xs">
          {member.email}
        </span>
      </span>
    </div>
  )
}

function RatingCell({
  formatter,
  labels,
  rating,
}: Readonly<{
  formatter: TableFormatter
  labels: Team2Labels
  rating: number
}>) {
  const filled = Math.round(rating)
  const text = formatter.number(rating, 1)

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {starPositions.map((position) => (
          <StarIcon
            className={cn(
              'size-3.5',
              position <= filled
                ? 'text-warning-foreground'
                : 'text-muted-foreground/40',
            )}
            key={position}
            weight={position <= filled ? 'fill' : 'regular'}
          />
        ))}
      </span>
      <span aria-hidden="true" className="text-sm tabular-nums">
        {text}
      </span>
      <span className="sr-only">{labels.rating(text)}</span>
    </div>
  )
}

function LastSeenCell({
  formatter,
  labels,
  member,
}: Readonly<{
  formatter: TableFormatter
  labels: Team2Labels
  member: Team2Member
}>) {
  if (member.presence === 'online') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-success"
          data-presence="online"
        />
        {labels.presence.online}
      </span>
    )
  }
  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {formatter.date(member.lastSeen)}
    </span>
  )
}

function ActivityCell({
  formatter,
  labels,
  ratio,
}: Readonly<{
  formatter: TableFormatter
  labels: Team2Labels
  ratio: number
}>) {
  const percent = formatter.percent(ratio)

  return (
    <div className="flex items-center gap-2">
      <ProgressRing className="size-6" ratio={ratio} strokeWidth={14} />
      <span aria-hidden="true" className="text-sm tabular-nums">
        {percent}
      </span>
      <span className="sr-only">{labels.activity(percent)}</span>
    </div>
  )
}

export function createTeam2Columns({
  formatter,
  labels,
  locale,
}: Readonly<ColumnsInput>): DataTableColumnDef<Team2Member>[] {
  const title = (id: Team2ColumnId) => labels.columns[id]
  const priorityOptions = dataSelectOptions(
    dataPriorities,
    labels.priorities,
    dataPriorityAppearance,
  )

  return [
    {
      accessorFn: (member) => `${member.name} ${member.email}`,
      cell: ({ row }) => <MemberCell labels={labels} member={row.original} />,
      enableHiding: false,
      filterFn: 'includesString',
      header: title('member'),
      id: 'member',
      meta: { label: title('member') },
      size: 280,
    },
    {
      accessorFn: (member) => member.role.label,
      cell: ({ row }) => (
        <DataSelect
          ariaLabel={title('role')}
          options={[
            {
              icon: IdentificationBadgeIcon,
              label: row.original.role.label,
              tone: row.original.role.tone ?? 'neutral',
              value: row.original.role.label,
            },
          ]}
          value={row.original.role.label}
        />
      ),
      filterFn: 'equalsString',
      header: title('role'),
      id: 'role',
      meta: { label: title('role') },
      size: 130,
    },
    {
      accessorFn: (member) => member.team.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AvatarStack
            aria-label={labels.teamMembers(row.original.team.name)}
            max={3}
            people={row.original.team.members}
            size="sm"
          />
          <span className="truncate">{row.original.team.name}</span>
        </div>
      ),
      enableSorting: false,
      filterFn: 'equalsString',
      header: title('team'),
      id: 'team',
      meta: { label: title('team') },
      size: 220,
    },
    {
      accessorFn: (member) => member.rating,
      cell: ({ row }) => (
        <RatingCell
          formatter={formatter}
          labels={labels}
          rating={row.original.rating}
        />
      ),
      enableColumnFilter: false,
      header: title('rating'),
      id: 'rating',
      meta: { label: title('rating') },
      size: 180,
    },
    {
      accessorFn: (member) => member.lastSeen,
      cell: ({ row }) => (
        <LastSeenCell
          formatter={formatter}
          labels={labels}
          member={row.original}
        />
      ),
      enableColumnFilter: false,
      header: title('lastSeen'),
      id: 'lastSeen',
      meta: { label: title('lastSeen') },
      size: 160,
    },
    {
      accessorFn: (member) => member.activity,
      cell: ({ row }) => (
        <ActivityCell
          formatter={formatter}
          labels={labels}
          ratio={row.original.activity}
        />
      ),
      enableColumnFilter: false,
      enableSorting: false,
      header: title('activity'),
      id: 'activity',
      meta: { label: title('activity') },
      size: 140,
    },
    {
      accessorFn: (member) => labels.priorities[member.priority],
      cell: ({ row }) => (
        <DataSelect
          ariaLabel={title('priority')}
          options={priorityOptions}
          value={row.original.priority}
        />
      ),
      enableColumnFilter: false,
      enableSorting: false,
      header: title('priority'),
      id: 'priority',
      meta: { label: title('priority') },
      size: 130,
    },
    {
      accessorFn: (member) => member.location,
      cell: ({ row }) => (
        <span className="truncate">{row.original.location}</span>
      ),
      enableSorting: false,
      filterFn: 'includesString',
      header: title('location'),
      id: 'location',
      meta: { label: title('location') },
      size: 160,
    },
    {
      accessorFn: (member) => member.joined,
      cell: ({ row }) => (
        <DataDate
          ariaLabel={title('joined')}
          displayLabel={formatter.date(row.original.joined)}
          fallback="—"
          locale={locale}
          timeZone="UTC"
          value={row.original.joined}
        />
      ),
      enableColumnFilter: false,
      header: title('joined'),
      id: 'joined',
      meta: { label: title('joined') },
      size: 150,
    },
  ]
}
