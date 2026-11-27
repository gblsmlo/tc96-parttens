import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import { ListViewHeaderCell } from '@tc96/ui/patterns/list-view/components/list-view-header'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import type { ReactNode } from 'react'
import {
  TasksAssigneesField,
  TasksCreatorField,
  TasksDueField,
  type TasksFieldContext,
  TasksKindField,
  TasksPriorityField,
  TasksStatusField,
  TasksStatusMark,
  TasksTagsField,
  TasksUpdatedField,
} from './tasks-fields'
import type {
  TasksColumnId,
  TasksLabels,
  TasksSort,
  TasksSortColumn,
  TasksSortDirection,
  TasksTask,
} from './types'

export type TasksCells = Record<TasksColumnId, (task: TasksTask) => ReactNode>

export const tasksTableColumnIds: readonly TasksColumnId[] = [
  'title',
  'tags',
  'due',
  'kind',
  'assignees',
  'priority',
  'updated',
]

export const tasksTableToggleableColumns: readonly TasksColumnId[] = [
  'tags',
  'due',
  'kind',
  'assignees',
  'priority',
  'updated',
]

const columnSize = {
  assignees: 200,
  creator: 180,
  due: 150,
  kind: 190,
  priority: 150,
  status: 160,
  tags: 200,
  title: 360,
  updated: 170,
} as const satisfies Record<TasksColumnId, number>

const accessorOf = {
  assignees: (task) => task.assigneeIds,
  creator: (task) => task.creatorId,
  due: (task) => task.dueAt,
  kind: (task) => task.kindId,
  priority: (task) => task.priority,
  status: (task) => task.status,
  tags: (task) => task.tagIds,
  title: (task) => task.title,
  updated: (task) => task.updatedAt,
} as const satisfies Record<TasksColumnId, (task: TasksTask) => unknown>

const sortColumnOf: Partial<Record<TasksColumnId, TasksSortColumn>> = {
  due: 'due',
  kind: 'kind',
  priority: 'priority',
  title: 'title',
  updated: 'updated',
}

export function createTasksCells(context: TasksFieldContext): TasksCells {
  const field =
    (
      Field: (props: {
        context: TasksFieldContext
        item: TasksTask
      }) => ReactNode,
    ) =>
    (task: TasksTask) => <Field context={context} item={task} />
  return {
    assignees: field(TasksAssigneesField),
    creator: field(TasksCreatorField),
    due: field(TasksDueField),
    kind: field(TasksKindField),
    priority: field(TasksPriorityField),
    status: field(TasksStatusField),
    tags: field(TasksTagsField),
    title: (task) => (
      <IconLabelProperty
        className="gap-2 font-medium text-foreground"
        label={task.title}
        leading={<TasksStatusMark context={context} item={task} />}
        variant="plain"
      />
    ),
    updated: field(TasksUpdatedField),
  }
}

export interface TasksColumnsOptions {
  cells: TasksCells
  columnIds?: readonly TasksColumnId[]
  labels: TasksLabels
  onSort?: (column: TasksSortColumn) => void
  selectable: boolean
  sort: TasksSort
  sortDirection: TasksSortDirection
}

export function createTasksColumns({
  cells,
  columnIds = tasksTableColumnIds,
  labels,
  onSort,
  selectable,
  sort,
  sortDirection,
}: TasksColumnsOptions): DataTableColumnDef<TasksTask>[] {
  const headerOf = (id: TasksColumnId) => {
    const column = sortColumnOf[id]
    if (!column || !onSort) return labels.columns[id]
    const direction = sort === column ? sortDirection : null
    return () => (
      <ListViewHeaderCell
        always
        onSort={() => onSort(column)}
        sortDirection={direction}
        sortLabel={labels.sortColumn(column, direction)}
      >
        {labels.columns[id]}
      </ListViewHeaderCell>
    )
  }

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<TasksTask>({
            getRowLabel: (task) => labels.selectTask(task.title),
            selectAllLabel: labels.selectAll,
          }),
        ]
      : []),
    ...columnIds.map(
      (id): DataTableColumnDef<TasksTask> => ({
        accessorFn: accessorOf[id],
        cell: ({ row }) => cells[id](row.original),
        enableHiding: id !== 'title',
        header: headerOf(id),
        id,
        meta: { label: labels.columns[id] },
        size: columnSize[id],
      }),
    ),
  ]
}
