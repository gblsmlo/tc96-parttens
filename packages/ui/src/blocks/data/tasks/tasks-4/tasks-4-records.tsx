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
import type {
  TasksColumnId,
  TasksSort,
  TasksSortColumn,
  TasksSortDirection,
  TasksTask,
} from '../shared'
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
} from '../shared/tasks-fields'
import { tasks4FieldWidth, tasks4LeadingWidth } from './tasks-4-options'
import type { Tasks4Labels } from './types'

export interface Tasks4ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface Tasks4ListHeaderProps {
  labels: Tasks4Labels
  visibleColumns: ReadonlySet<TasksColumnId>
  selection?: Tasks4ListHeaderSelection
  onSort?: (column: TasksSortColumn) => void
  sort: TasksSort
  sortDirection: TasksSortDirection
}

export function Tasks4ListHeader({
  labels,
  visibleColumns,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Tasks4ListHeaderProps>) {
  const sortable = (column: TasksSortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort ? labels.sortColumn(column, direction) : undefined,
    }
  }

  return (
    <ListViewHeader data-slot="tasks-4-list-header">
      <ListViewHeaderCell
        always
        className={cn(tasks4LeadingWidth, '-me-0.5 ps-1')}
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
      {visibleColumns.has('due') ? (
        <ListViewHeaderCell
          always
          className={tasks4FieldWidth.due}
          {...sortable('due')}
        >
          {labels.columns.due}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('priority') ? (
        <ListViewHeaderCell
          className={tasks4FieldWidth.priority}
          {...sortable('priority')}
        >
          {labels.columns.priority}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('kind') ? (
        <ListViewHeaderCell
          className={tasks4FieldWidth.kind}
          {...sortable('kind')}
        >
          {labels.columns.kind}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('assignees') ? (
        <ListViewHeaderCell className={tasks4FieldWidth.assignees}>
          {labels.columns.assignees}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('updated') ? (
        <ListViewHeaderCell
          className={tasks4FieldWidth.updated}
          {...sortable('updated')}
        >
          {labels.columns.updated}
        </ListViewHeaderCell>
      ) : null}
    </ListViewHeader>
  )
}

export const renderTasks4ListRow =
  (context: TasksFieldContext) => (task: TasksTask) => {
    const { labels, onOpen, onSelectedChange, selectedIds, visibleColumns } =
      context
    const selected = selectedIds.has(task.id)
    return (
      <ListRow
        data-slot="tasks-4-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(tasks4LeadingWidth, '-me-0.5 ps-1')}>
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
            {visibleColumns.has('tags') ? (
              <span className="hidden shrink-0 md:flex">
                <TasksTagsField context={context} item={task} />
              </span>
            ) : null}
          </ListRowHeader>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          {visibleColumns.has('due') ? (
            <ListRowField always className={tasks4FieldWidth.due}>
              <TasksDueField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('priority') ? (
            <ListRowField className={tasks4FieldWidth.priority}>
              <TasksPriorityField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('kind') ? (
            <ListRowField className={tasks4FieldWidth.kind}>
              <TasksKindField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('assignees') ? (
            <ListRowField className={tasks4FieldWidth.assignees}>
              <TasksAssigneesField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('updated') ? (
            <ListRowField className={tasks4FieldWidth.updated}>
              <TasksUpdatedField context={context} item={task} />
            </ListRowField>
          ) : null}
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks4KanbanCard =
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
