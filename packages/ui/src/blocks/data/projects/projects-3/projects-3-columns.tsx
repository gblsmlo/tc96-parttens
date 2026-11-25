import {
  DataTableExpandToggle,
  type DataTableExpandToggleProps,
} from '@tc96/ui/patterns/data-table/data-table-expand-toggle'
import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  Projects3ArchivedMark,
  Projects3AssigneeField,
  Projects3DueField,
  type Projects3FieldContext,
  Projects3PriorityField,
  Projects3StartField,
  Projects3StatusField,
  Projects3TagsField,
  Projects3TypeField,
} from './projects-3-fields'
import type { Projects3ColumnId, Projects3Task } from './types'

type TaskRow = DataTableExpandToggleProps<Projects3Task>['row']

function Projects3TitleCell({
  context,
  row,
}: Readonly<{ context: Projects3FieldContext; row: TaskRow }>) {
  const { labels } = context
  const task = row.original
  return (
    <DataTableExpandToggle
      getLabel={(current, expanded) =>
        expanded
          ? labels.collapse(current.original.title)
          : labels.expand(current.original.title)
      }
      row={row}
    >
      <span className="grid min-w-0 gap-0.5" data-slot="projects-3-title">
        <span className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate font-medium">{task.title}</span>
          <Projects3ArchivedMark context={context} item={task} />
        </span>
        {task.description ? (
          <span className="truncate text-muted-foreground text-xs">
            {task.description}
          </span>
        ) : null}
      </span>
    </DataTableExpandToggle>
  )
}

function createProjects3SelectColumn(
  context: Projects3FieldContext,
): DataTableColumnDef<Projects3Task> {
  const { labels } = context
  const column = createDataTableSelectColumn<Projects3Task>({
    getRowLabel: (task) => labels.selectTask(task.title),
    selectAllLabel: labels.selectAll,
  })
  const { cell } = column
  return {
    ...column,
    cell: (cellContext) =>
      cellContext.row.getCanSelect() && typeof cell === 'function'
        ? cell(cellContext)
        : null,
  }
}

export function createProjects3Columns(
  context: Projects3FieldContext,
  selectable: boolean,
): DataTableColumnDef<Projects3Task>[] {
  const { labels } = context
  const column = (id: Projects3ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable ? [createProjects3SelectColumn(context)] : []),
    {
      ...column('title'),
      accessorFn: (task) => task.title,
      cell: ({ row }) => <Projects3TitleCell context={context} row={row} />,
      size: 360,
    },
    {
      ...column('type'),
      accessorFn: (task) => task.type,
      cell: ({ row }) => (
        <Projects3TypeField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('priority'),
      accessorFn: (task) => task.priority,
      cell: ({ row }) => (
        <Projects3PriorityField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('status'),
      accessorFn: (task) => task.status,
      cell: ({ row }) => (
        <Projects3StatusField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('start'),
      accessorFn: (task) => task.startAt,
      cell: ({ row }) => (
        <Projects3StartField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('due'),
      accessorFn: (task) => task.dueAt,
      cell: ({ row }) => (
        <Projects3DueField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('assignee'),
      accessorFn: (task) => task.assigneeId,
      cell: ({ row }) => (
        <Projects3AssigneeField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('tags'),
      accessorFn: (task) => task.tagIds,
      cell: ({ row }) => (
        <Projects3TagsField context={context} item={row.original} />
      ),
      size: 220,
    },
  ]
}
