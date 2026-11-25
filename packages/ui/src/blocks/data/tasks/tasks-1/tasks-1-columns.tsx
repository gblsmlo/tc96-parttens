import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  Tasks1AssigneesField,
  Tasks1DueField,
  type Tasks1FieldContext,
  Tasks1PriorityField,
  Tasks1ProjectField,
  Tasks1StatusMark,
  Tasks1TagsField,
  Tasks1UpdatedField,
} from './tasks-1-fields'
import type { Tasks1ColumnId, Tasks1Task } from './types'

function Tasks1TaskCell({
  context,
  item,
}: Readonly<{ context: Tasks1FieldContext; item: Tasks1Task }>) {
  return (
    <span className="flex min-w-0 items-center gap-2" data-slot="tasks-1-task">
      <Tasks1StatusMark context={context} item={item} />
      <span className="min-w-0 truncate font-medium">{item.title}</span>
    </span>
  )
}

export function createTasks1Columns(
  context: Tasks1FieldContext,
  selectable: boolean,
): DataTableColumnDef<Tasks1Task>[] {
  const { labels } = context
  const column = (id: Tasks1ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Tasks1Task>({
            getRowLabel: (task) => labels.selectTask(task.title),
            selectAllLabel: labels.selectAll,
          }),
        ]
      : []),
    {
      ...column('task'),
      accessorFn: (task) => task.title,
      cell: ({ row }) => (
        <Tasks1TaskCell context={context} item={row.original} />
      ),
      enableHiding: false,
      size: 360,
    },
    {
      ...column('tags'),
      accessorFn: (task) => task.tagIds,
      cell: ({ row }) => (
        <Tasks1TagsField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('due'),
      accessorFn: (task) => task.dueAt,
      cell: ({ row }) => (
        <Tasks1DueField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('project'),
      accessorFn: (task) => task.projectId,
      cell: ({ row }) => (
        <Tasks1ProjectField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('assignees'),
      accessorFn: (task) => task.assigneeIds,
      cell: ({ row }) => (
        <Tasks1AssigneesField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('priority'),
      accessorFn: (task) => task.priority,
      cell: ({ row }) => (
        <Tasks1PriorityField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('updated'),
      accessorFn: (task) => task.updatedAt,
      cell: ({ row }) => (
        <Tasks1UpdatedField context={context} item={row.original} />
      ),
      size: 170,
    },
  ]
}
