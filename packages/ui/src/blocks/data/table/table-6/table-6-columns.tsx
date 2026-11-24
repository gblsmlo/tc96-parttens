import {
  CalendarBlankIcon,
  DotsThreeIcon,
  TrendDownIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { UseDataTableOptions } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { cn } from '@tc96/utils'
import type { TableFormatter } from '../shared/format'
import type {
  Table6Account,
  Table6ColumnId,
  Table6Health,
  Table6Labels,
  Table6Person,
  Table6RowAction,
} from './types'

const tileColors = [
  'var(--info-foreground)',
  'var(--success-foreground)',
  'var(--destructive-foreground)',
  'var(--foreground)',
] as const

const healthTones = {
  atRisk: 'error',
  healthy: 'success',
  watch: 'warning',
} as const satisfies Record<Table6Health, string>

export const table6HealthOrder: readonly Table6Health[] = [
  'healthy',
  'watch',
  'atRisk',
]

const tileColor = (id: string) => {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return tileColors[hash % tileColors.length]
}

export function OwnerCell({ person }: Readonly<{ person: Table6Person }>) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="[--avatar-size:--spacing(6)]">
        {person.imageUrl ? <AvatarImage alt="" src={person.imageUrl} /> : null}
        <AvatarFallback>{getInitials(person.label)}</AvatarFallback>
      </Avatar>
      <span className="truncate">{person.label}</span>
    </span>
  )
}

export function Table6Nrr({
  formatter,
  labels,
  value,
}: Readonly<{
  formatter: TableFormatter
  labels: Table6Labels
  value: number
}>) {
  const below = value < 1
  const Icon = below ? TrendDownIcon : TrendUpIcon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 tabular-nums',
        below ? 'text-destructive-foreground' : 'text-success-foreground',
      )}
      data-below={below ? 'true' : undefined}
      data-slot="table-6-nrr"
    >
      <Icon aria-hidden="true" className="size-3.5" />
      <span className="sr-only">{labels.nrrTrend(below ? 'down' : 'up')}</span>
      {formatter.percent(value)}
    </span>
  )
}

export interface Table6ColumnsInput {
  formatter: TableFormatter
  labels: Table6Labels
  onRowAction?: (actionId: string, accountId: string) => void
  rowActions?: Table6RowAction[]
}

export function createTable6Columns({
  formatter,
  labels,
  onRowAction,
  rowActions,
}: Readonly<Table6ColumnsInput>): UseDataTableOptions<Table6Account>['columns'] {
  const title = (id: Table6ColumnId) => labels.columns[id]

  const columns: UseDataTableOptions<Table6Account>['columns'] = [
    {
      accessorFn: (account) => account.name,
      cell: ({ row }) => (
        <span className="flex min-w-0 items-center gap-3 ps-6">
          <IconFrame
            className="font-semibold text-xs"
            color={tileColor(row.original.id)}
            shape="rounded"
            size="xs"
          >
            {getInitials(row.original.name)}
          </IconFrame>
          <span className="truncate font-medium">{row.original.name}</span>
        </span>
      ),
      enableColumnFilter: false,
      enableHiding: false,
      header: title('account'),
      id: 'account',
      meta: { label: title('account') },
      size: 280,
    },
    {
      accessorFn: (account) => account.owner.label,
      cell: ({ row }) => <OwnerCell person={row.original.owner} />,
      enableColumnFilter: false,
      header: title('owner'),
      id: 'owner',
      meta: { label: title('owner') },
      size: 220,
    },
    {
      accessorFn: (account) => account.health,
      cell: ({ row }) => (
        <Badge
          data-health={row.original.health}
          variant={healthTones[row.original.health]}
        >
          {labels.health[row.original.health]}
        </Badge>
      ),
      enableGlobalFilter: false,
      filterFn: (row, columnId, value) =>
        !value || row.getValue(columnId) === value,
      header: title('health'),
      id: 'health',
      meta: { label: title('health') },
      size: 130,
    },
    {
      accessorFn: (account) => account.arr,
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatter.money(row.original.arr)}
        </span>
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      header: title('arr'),
      id: 'arr',
      meta: { align: 'end', label: title('arr') },
      size: 150,
    },
    {
      accessorFn: (account) => account.nrr,
      cell: ({ row }) => (
        <Table6Nrr
          formatter={formatter}
          labels={labels}
          value={row.original.nrr}
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      header: title('nrr'),
      id: 'nrr',
      meta: { align: 'end', label: title('nrr') },
      size: 130,
    },
    {
      accessorFn: (account) => account.renewal,
      cell: ({ row }) => (
        <Badge className="tabular-nums" variant="outline">
          <CalendarBlankIcon aria-hidden="true" />
          {formatter.date(row.original.renewal)}
        </Badge>
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      header: title('renewal'),
      id: 'renewal',
      meta: { align: 'end', label: title('renewal') },
      size: 190,
    },
  ]

  if (onRowAction && rowActions?.length) {
    columns.push({
      cell: ({ row }) => (
        <Menu>
          <MenuTrigger
            aria-label={labels.rowActionsFor(row.original.name)}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <DotsThreeIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuPopup align="end">
            {rowActions.map((action) => (
              <MenuItem
                key={action.id}
                onClick={() => onRowAction(action.id, row.original.id)}
                variant={action.destructive ? 'destructive' : undefined}
              >
                {action.label}
              </MenuItem>
            ))}
          </MenuPopup>
        </Menu>
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
      header: () => <span className="sr-only">{title('actions')}</span>,
      id: 'actions',
      meta: { align: 'end', label: title('actions') },
      size: 56,
    })
  }

  return columns
}
