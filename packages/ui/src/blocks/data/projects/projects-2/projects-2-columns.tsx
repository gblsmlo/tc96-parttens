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
  DataTableExpandToggle,
  type DataTableExpandToggleProps,
} from '@tc96/ui/patterns/data-table/data-table-expand-toggle'
import type { UseDataTableOptions } from '@tc96/ui/patterns/data-table/use-data-table'
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
  projects2StatusAppearance,
  projects2Statuses,
} from './projects-2-options'
import type {
  Projects2ColumnId,
  Projects2Labels,
  Projects2Person,
  Projects2RowAction,
  Projects2Task,
} from './types'

type TaskRow = DataTableExpandToggleProps<Projects2Task>['row']

const equalsFilter = (row: TaskRow, columnId: string, value: unknown) =>
  !value || row.getValue(columnId) === value

export interface Projects2ColumnsInput {
  labels: Projects2Labels
  onRowAction?: (actionId: string, taskId: string) => void
  rowActions?: Projects2RowAction[]
}

function TaskCell({
  labels,
  row,
}: Readonly<{ labels: Projects2Labels; row: TaskRow }>) {
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
        data-slot="projects-2-task-title"
      >
        {task.title}
      </span>
    </DataTableExpandToggle>
  )
}

function AssigneeCell({ person }: Readonly<{ person: Projects2Person }>) {
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

export function createProjects2Columns({
  labels,
  onRowAction,
  rowActions,
}: Readonly<Projects2ColumnsInput>): UseDataTableOptions<Projects2Task>['columns'] {
  const title = (id: Projects2ColumnId) => labels.columns[id]
  const statusOptions = dataSelectOptions(
    projects2Statuses,
    labels.statuses,
    projects2StatusAppearance,
  )
  const priorityOptions = dataSelectOptions(
    dataPriorities,
    labels.priorities,
    dataPriorityAppearance,
  )

  const columns: UseDataTableOptions<Projects2Task>['columns'] = [
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
        projects2Statuses.indexOf(a.original.status) -
        projects2Statuses.indexOf(b.original.status),
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
