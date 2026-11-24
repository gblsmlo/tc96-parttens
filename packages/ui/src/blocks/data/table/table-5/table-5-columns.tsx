import {
  CheckCircleIcon,
  CircleIcon,
  DotsThreeIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  DataTableExpandToggle,
  type DataTableExpandToggleProps,
} from '@tc96/ui/patterns/collection/layouts/data-table/data-table-expand-toggle'
import type { UseDataTableOptions } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { cn } from '@tc96/utils'
import type {
  Table5ColumnId,
  Table5Labels,
  Table5Person,
  Table5Priority,
  Table5RowAction,
  Table5Status,
  Table5Task,
} from './types'

export const table5StatusOrder: readonly Table5Status[] = [
  'backlog',
  'todo',
  'inProgress',
  'review',
  'done',
]

export const table5PriorityOrder: readonly Table5Priority[] = [
  'low',
  'medium',
  'high',
  'urgent',
]

type TaskRow = DataTableExpandToggleProps<Table5Task>['row']

const statusDots = {
  backlog: 'bg-muted-foreground',
  done: 'bg-success',
  inProgress: 'bg-warning',
  review: 'bg-primary',
  todo: 'bg-info',
} as const satisfies Record<Table5Status, string>

const priorityTones = {
  high: 'warning',
  low: 'secondary',
  medium: 'info',
  urgent: 'error',
} as const satisfies Record<Table5Priority, string>

const equalsFilter = (row: TaskRow, columnId: string, value: unknown) =>
  !value || row.getValue(columnId) === value

export interface Table5ColumnsInput {
  labels: Table5Labels
  onRowAction?: (actionId: string, taskId: string) => void
  rowActions?: Table5RowAction[]
}

function TaskCell({
  labels,
  row,
}: Readonly<{ labels: Table5Labels; row: TaskRow }>) {
  const task = row.original
  const done = task.status === 'done'
  const Icon = done ? CheckCircleIcon : CircleIcon

  return (
    <DataTableExpandToggle
      getLabel={(current, expanded) =>
        expanded
          ? labels.collapse(current.original.title)
          : labels.expand(current.original.title)
      }
      row={row}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          'size-4 shrink-0',
          done ? 'text-foreground' : 'text-muted-foreground',
        )}
        data-done={done ? 'true' : undefined}
        weight={done ? 'fill' : 'regular'}
      />
      <span
        className={cn('truncate', done && 'text-muted-foreground line-through')}
        data-slot="table-5-task-title"
      >
        {task.title}
      </span>
    </DataTableExpandToggle>
  )
}

function AssigneeCell({ person }: Readonly<{ person: Table5Person }>) {
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

export function createTable5Columns({
  labels,
  onRowAction,
  rowActions,
}: Readonly<Table5ColumnsInput>): UseDataTableOptions<Table5Task>['columns'] {
  const title = (id: Table5ColumnId) => labels.columns[id]

  const columns: UseDataTableOptions<Table5Task>['columns'] = [
    {
      accessorFn: (task) => task.title,
      cell: ({ row }) => <TaskCell labels={labels} row={row} />,
      enableColumnFilter: false,
      enableHiding: false,
      header: title('task'),
      id: 'task',
      meta: { label: title('task') },
      size: 420,
    },
    {
      accessorFn: (task) => task.status,
      cell: ({ row }) => (
        <Badge data-status={row.original.status} variant="outline">
          <span
            aria-hidden="true"
            className={cn(
              'size-1.5 rounded-full',
              statusDots[row.original.status],
            )}
          />
          {labels.statuses[row.original.status]}
        </Badge>
      ),
      enableGlobalFilter: false,
      filterFn: equalsFilter,
      header: title('status'),
      id: 'status',
      meta: { label: title('status') },
      size: 150,
      sortFn: (a, b) =>
        table5StatusOrder.indexOf(a.original.status) -
        table5StatusOrder.indexOf(b.original.status),
    },
    {
      accessorFn: (task) => task.assignee.label,
      cell: ({ row }) => <AssigneeCell person={row.original.assignee} />,
      enableColumnFilter: false,
      header: title('assignee'),
      id: 'assignee',
      meta: { label: title('assignee') },
      size: 180,
    },
    {
      accessorFn: (task) => task.priority,
      cell: ({ row }) => (
        <Badge
          data-priority={row.original.priority}
          variant={priorityTones[row.original.priority]}
        >
          {labels.priorities[row.original.priority]}
        </Badge>
      ),
      enableGlobalFilter: false,
      filterFn: equalsFilter,
      header: title('priority'),
      id: 'priority',
      meta: { label: title('priority') },
      size: 130,
      sortFn: (a, b) =>
        table5PriorityOrder.indexOf(a.original.priority) -
        table5PriorityOrder.indexOf(b.original.priority),
    },
    {
      accessorFn: (task) => task.project,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.project}</Badge>
      ),
      filterFn: equalsFilter,
      header: title('project'),
      id: 'project',
      meta: { label: title('project') },
      size: 170,
    },
  ]

  if (onRowAction && rowActions?.length) {
    columns.push({
      cell: ({ row }) => (
        <Menu>
          <MenuTrigger
            aria-label={labels.rowActionsFor(row.original.title)}
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
