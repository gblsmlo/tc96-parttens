import { Checkbox } from '@tc96/ui/checkbox'
import {
  ListRow,
  ListRowBody,
  ListRowField,
  ListRowHeader,
  ListRowLeading,
  ListRowOpenTrigger,
  ListRowSelect,
  ListRowTitle,
  ListRowTrailing,
} from '@tc96/ui/patterns/list-view/components/list-row'
import {
  ListViewHeader,
  ListViewHeaderCell,
} from '@tc96/ui/patterns/list-view/components/list-view-header'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { cn } from '@tc96/utils'
import { DataCollectionKanbanCard } from '../../shared/collection/data-collection-record-parts'
import {
  TasksAssigneesField,
  TasksDueField,
  type TasksFieldContext,
  TasksKindField,
  TasksPriorityField,
  TasksPriorityMark,
  TasksStatusMark,
  TasksTags,
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

const tasksLeadingWidth = 'w-5'

const tasksFieldWidth = {
  assignees: 'w-40',
  due: 'w-32',
  kind: 'w-40',
  priority: 'w-32',
  tags: 'w-48',
  updated: 'w-20',
} as const satisfies Partial<Record<TasksColumnId, string>>

export const tasksListToggleableColumns: readonly TasksColumnId[] = [
  'tags',
  'due',
  'priority',
  'kind',
  'assignees',
  'updated',
]

export interface TasksListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface TasksListHeaderProps {
  labels: TasksLabels
  visibleColumns: ReadonlySet<TasksColumnId>
  selection?: TasksListHeaderSelection
  onSort?: (column: TasksSortColumn) => void
  sort: TasksSort
  sortDirection: TasksSortDirection
}

export function TasksListHeader({
  labels,
  visibleColumns,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<TasksListHeaderProps>) {
  const sortable = (column: TasksSortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort ? labels.sortColumn(column, direction) : undefined,
    }
  }

  return (
    <ListViewHeader data-slot="tasks-list-header">
      <ListViewHeaderCell
        always
        className={cn(tasksLeadingWidth, '-me-0.5 ps-1')}
      >
        {selection ? (
          <Checkbox
            aria-label={labels.selectAll}
            checked={selection.checked}
            indeterminate={selection.indeterminate}
            onCheckedChange={(checked) =>
              selection.onCheckedChange(checked === true)
            }
          />
        ) : null}
      </ListViewHeaderCell>
      <ListViewHeaderCell always className="flex-1" {...sortable('title')}>
        {labels.columns.title}
      </ListViewHeaderCell>
      {visibleColumns.has('tags') ? (
        <ListViewHeaderCell className={tasksFieldWidth.tags}>
          {labels.columns.tags}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('due') ? (
        <ListViewHeaderCell
          always
          className={tasksFieldWidth.due}
          {...sortable('due')}
        >
          {labels.columns.due}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('priority') ? (
        <ListViewHeaderCell
          className={tasksFieldWidth.priority}
          {...sortable('priority')}
        >
          {labels.columns.priority}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('kind') ? (
        <ListViewHeaderCell
          className={tasksFieldWidth.kind}
          {...sortable('kind')}
        >
          {labels.columns.kind}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('assignees') ? (
        <ListViewHeaderCell className={tasksFieldWidth.assignees}>
          {labels.columns.assignees}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('updated') ? (
        <ListViewHeaderCell
          className={tasksFieldWidth.updated}
          {...sortable('updated')}
        >
          {labels.columns.updated}
        </ListViewHeaderCell>
      ) : null}
    </ListViewHeader>
  )
}

export const renderTasksListRow =
  (context: TasksFieldContext) => (task: TasksTask) => {
    const { labels, onOpen, onSelectedChange, selectedIds, visibleColumns } =
      context
    const selected = selectedIds.has(task.id)
    return (
      <ListRow
        data-slot="tasks-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(tasksLeadingWidth, '-me-0.5 ps-1')}>
          {onSelectedChange ? (
            <ListRowSelect
              aria-label={labels.selectTask(task.title)}
              checked={selected}
              className="me-0"
              onCheckedChange={(checked) =>
                onSelectedChange(task.id, checked === true)
              }
            />
          ) : (
            <TasksPriorityMark context={context} item={task} />
          )}
        </ListRowLeading>
        <ListRowBody>
          <ListRowHeader>
            <ListRowTitle>
              <IconLabelProperty
                className="gap-2 font-medium text-foreground"
                label={
                  onOpen ? (
                    <ListRowOpenTrigger
                      aria-label={labels.openTask(task.title)}
                      onClick={() => onOpen(task.id)}
                    >
                      {task.title}
                    </ListRowOpenTrigger>
                  ) : (
                    task.title
                  )
                }
                leading={<TasksStatusMark context={context} item={task} />}
                variant="plain"
              />
            </ListRowTitle>
          </ListRowHeader>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          {visibleColumns.has('tags') ? (
            <ListRowField className={tasksFieldWidth.tags}>
              <TasksTagsField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('due') ? (
            <ListRowField always className={tasksFieldWidth.due}>
              <TasksDueField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('priority') ? (
            <ListRowField className={tasksFieldWidth.priority}>
              <TasksPriorityField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('kind') ? (
            <ListRowField className={tasksFieldWidth.kind}>
              <TasksKindField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('assignees') ? (
            <ListRowField className={tasksFieldWidth.assignees}>
              <TasksAssigneesField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('updated') ? (
            <ListRowField className={tasksFieldWidth.updated}>
              <TasksUpdatedField context={context} item={task} />
            </ListRowField>
          ) : null}
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasksKanbanCard =
  (context: TasksFieldContext) => (task: TasksTask) => {
    const {
      labels,
      onAssigneesChange,
      onDueChange,
      onOpen,
      onPriorityChange,
      kinds,
      visibleColumns,
    } = context
    const kind = visibleColumns.has('kind')
      ? kinds.find((item) => item.id === task.kindId)
      : undefined
    return (
      <DataCollectionKanbanCard
        caption={kind ? [kind.label] : []}
        fields={[
          ...(visibleColumns.has('due')
            ? [
                {
                  id: 'due',
                  interactive: Boolean(onDueChange),
                  label: labels.columns.due,
                  value: <TasksDueField context={context} item={task} />,
                },
              ]
            : []),
          ...(visibleColumns.has('priority')
            ? [
                {
                  id: 'priority',
                  interactive: Boolean(onPriorityChange),
                  label: labels.columns.priority,
                  value: <TasksPriorityField context={context} item={task} />,
                },
              ]
            : []),
          ...(visibleColumns.has('assignees')
            ? [
                {
                  id: 'assignees',
                  interactive: Boolean(onAssigneesChange),
                  label: labels.columns.assignees,
                  value: <TasksAssigneesField context={context} item={task} />,
                },
              ]
            : []),
        ]}
        footer={
          visibleColumns.has('tags') && task.tagIds.length > 0 ? (
            <TasksTags context={context} item={task} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(task.id) : undefined}
        openLabel={labels.openTask(task.title)}
        title={task.title}
      />
    )
  }
