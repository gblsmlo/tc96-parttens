import {
  CheckCircleIcon,
  CircleIcon,
  DotsThreeIcon,
  FolderIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  DataGridExpandToggle,
  type DataGridExpandToggleProps,
} from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-expand-toggle'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { cn } from '@tc96/utils'
import {
  dataPriorities,
  dataPriorityAppearance,
  dataPriorityRank,
} from '../../shared/properties/data-priority'
import {
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import {
  projects1StatusAppearance,
  projects1Statuses,
} from './projects-1-options'
import type {
  Projects1ColumnId,
  Projects1Labels,
  Projects1Person,
  Projects1RowAction,
  Projects1Task,
} from './types'

type TaskRow = DataGridExpandToggleProps<Projects1Task>['row']

const equalsFilter = (row: TaskRow, columnId: string, value: unknown) =>
  !value || row.getValue(columnId) === value

export interface Projects1ColumnsInput {
  labels: Projects1Labels
  onRowAction?: (actionId: string, taskId: string) => void
  rowActions?: Projects1RowAction[]
}

function TaskCell({
  labels,
  row,
}: Readonly<{ labels: Projects1Labels; row: TaskRow }>) {
  const task = row.original
  const done = task.status === 'done'
  const Icon = done ? CheckCircleIcon : CircleIcon

  return (
    <DataGridExpandToggle
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
        data-slot="projects-1-task-title"
      >
        {task.title}
      </span>
    </DataGridExpandToggle>
  )
}

function AssigneeCell({ person }: Readonly<{ person: Projects1Person }>) {
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

export function createProjects1Columns({
  labels,
  onRowAction,
  rowActions,
}: Readonly<Projects1ColumnsInput>): UseDataGridOptions<Projects1Task>['columns'] {
  const title = (id: Projects1ColumnId) => labels.columns[id]
  const statusOptions = dataSelectOptions(
    projects1Statuses,
    labels.statuses,
    projects1StatusAppearance,
  )
  const priorityOptions = dataSelectOptions(
    dataPriorities,
    labels.priorities,
    dataPriorityAppearance,
  )

  const columns: UseDataGridOptions<Projects1Task>['columns'] = [
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
        <DataSelect
          ariaLabel={title('status')}
          options={statusOptions}
          value={row.original.status}
        />
      ),
      enableGlobalFilter: false,
      filterFn: equalsFilter,
      header: title('status'),
      id: 'status',
      meta: { label: title('status') },
      size: 150,
      sortFn: (a, b) =>
        projects1Statuses.indexOf(a.original.status) -
        projects1Statuses.indexOf(b.original.status),
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
        <DataSelect
          ariaLabel={title('priority')}
          options={priorityOptions}
          value={row.original.priority}
        />
      ),
      enableGlobalFilter: false,
      filterFn: equalsFilter,
      header: title('priority'),
      id: 'priority',
      meta: { label: title('priority') },
      size: 130,
      sortFn: (a, b) =>
        dataPriorityRank[a.original.priority] -
        dataPriorityRank[b.original.priority],
    },
    {
      accessorFn: (task) => task.project,
      cell: ({ row }) => (
        <TextProperty
          ariaLabel={title('project')}
          icon={FolderIcon}
          value={row.original.project}
        />
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
