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
  TasksPriorityMark,
  TasksStatusMark,
  TasksTags,
  TasksTagsField,
  TasksUpdatedField,
} from '../shared/tasks-fields'
import { tasks2FieldWidth, tasks2LeadingWidth } from './tasks-2-options'
import type { Tasks2Labels } from './types'

export interface Tasks2ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface Tasks2ListHeaderProps {
  labels: Tasks2Labels
  visibleColumns: ReadonlySet<TasksColumnId>
  selection?: Tasks2ListHeaderSelection
  onSort?: (column: TasksSortColumn) => void
  sort: TasksSort
  sortDirection: TasksSortDirection
}

export function Tasks2ListHeader({
  labels,
  visibleColumns,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Tasks2ListHeaderProps>) {
  const sortable = (column: TasksSortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort ? labels.sortColumn(column, direction) : undefined,
    }
  }

  return (
    <ListViewHeader data-slot="tasks-2-list-header">
      <ListViewHeaderCell
        always
        className={cn(tasks2LeadingWidth, '-me-0.5 ps-1')}
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
          className={tasks2FieldWidth.due}
          {...sortable('due')}
        >
          {labels.columns.due}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('kind') ? (
        <ListViewHeaderCell
          className={tasks2FieldWidth.kind}
          {...sortable('kind')}
        >
          {labels.columns.kind}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('assignees') ? (
        <ListViewHeaderCell className={tasks2FieldWidth.assignees}>
          {labels.columns.assignees}
        </ListViewHeaderCell>
      ) : null}
      {visibleColumns.has('updated') ? (
        <ListViewHeaderCell
          className={tasks2FieldWidth.updated}
          {...sortable('updated')}
        >
          {labels.columns.updated}
        </ListViewHeaderCell>
      ) : null}
    </ListViewHeader>
  )
}

export const renderTasks2ListRow =
  (context: TasksFieldContext) => (task: TasksTask) => {
    const { labels, onOpen, onSelectedChange, selectedIds, visibleColumns } =
      context
    const selected = selectedIds.has(task.id)
    return (
      <ListRow
        data-slot="tasks-2-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(tasks2LeadingWidth, '-me-0.5 ps-1')}>
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
            <ListRowField always className={tasks2FieldWidth.due}>
              <TasksDueField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('kind') ? (
            <ListRowField className={tasks2FieldWidth.kind}>
              <TasksKindField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('assignees') ? (
            <ListRowField className={tasks2FieldWidth.assignees}>
              <TasksAssigneesField context={context} item={task} />
            </ListRowField>
          ) : null}
          {visibleColumns.has('updated') ? (
            <ListRowField className={tasks2FieldWidth.updated}>
              <TasksUpdatedField context={context} item={task} />
            </ListRowField>
          ) : null}
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks2KanbanCard =
  (context: TasksFieldContext) => (task: TasksTask) => {
    const {
      labels,
      onAssigneesChange,
      onDueChange,
      onOpen,
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
