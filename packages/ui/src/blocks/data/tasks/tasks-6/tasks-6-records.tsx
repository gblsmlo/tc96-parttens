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
  Tasks6AssigneesField,
  Tasks6DueField,
  type Tasks6FieldContext,
  Tasks6PriorityMark,
  Tasks6ProjectField,
  Tasks6StatusMark,
  Tasks6Tags,
  Tasks6TagsField,
  Tasks6UpdatedField,
} from './tasks-6-fields'
import { tasks6FieldWidth, tasks6LeadingWidth } from './tasks-6-options'
import type {
  Tasks6Labels,
  Tasks6Sort,
  Tasks6SortColumn,
  Tasks6SortDirection,
  Tasks6Task,
} from './types'

export interface Tasks6ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface Tasks6ListHeaderProps {
  labels: Tasks6Labels
  selection?: Tasks6ListHeaderSelection
  onSort?: (column: Tasks6SortColumn) => void
  sort: Tasks6Sort
  sortDirection: Tasks6SortDirection
}

export function Tasks6ListHeader({
  labels,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Tasks6ListHeaderProps>) {
  const sortable = (column: Tasks6SortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort ? labels.sortColumn(column, direction) : undefined,
    }
  }

  return (
    <ListViewHeader data-slot="tasks-6-list-header">
      <ListViewHeaderCell
        always
        className={cn(tasks6LeadingWidth, '-me-0.5 ps-1')}
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
      <ListViewHeaderCell className={tasks6FieldWidth.tags}>
        {labels.columns.tags}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        always
        className={tasks6FieldWidth.due}
        {...sortable('due')}
      >
        {labels.columns.due}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks6FieldWidth.project}
        {...sortable('project')}
      >
        {labels.columns.project}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={tasks6FieldWidth.assignees}>
        {labels.columns.assignees}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks6FieldWidth.updated}
        {...sortable('updated')}
      >
        {labels.columns.updated}
      </ListViewHeaderCell>
    </ListViewHeader>
  )
}

export const renderTasks6ListRow =
  (context: Tasks6FieldContext) => (task: Tasks6Task) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
    const selected = selectedIds.has(task.id)
    return (
      <ListRow
        data-slot="tasks-6-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(tasks6LeadingWidth, '-me-0.5 ps-1')}>
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
            <Tasks6PriorityMark context={context} item={task} />
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
                leading={<Tasks6StatusMark context={context} item={task} />}
                variant="plain"
              />
            </ListRowTitle>
          </ListRowHeader>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField className={tasks6FieldWidth.tags}>
            <Tasks6TagsField context={context} item={task} />
          </ListRowField>
          <ListRowField always className={tasks6FieldWidth.due}>
            <Tasks6DueField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks6FieldWidth.project}>
            <Tasks6ProjectField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks6FieldWidth.assignees}>
            <Tasks6AssigneesField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks6FieldWidth.updated}>
            <Tasks6UpdatedField context={context} item={task} />
          </ListRowField>
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks6KanbanCard =
  (context: Tasks6FieldContext) => (task: Tasks6Task) => {
    const { labels, onAssigneesChange, onDueChange, onOpen, projects } = context
    const project = projects.find((item) => item.id === task.projectId)
    return (
      <DataCollectionKanbanCard
        caption={project ? [project.label] : []}
        fields={[
          {
            id: 'due',
            interactive: Boolean(onDueChange),
            label: labels.columns.due,
            value: <Tasks6DueField context={context} item={task} />,
          },
          {
            id: 'assignees',
            interactive: Boolean(onAssigneesChange),
            label: labels.columns.assignees,
            value: <Tasks6AssigneesField context={context} item={task} />,
          },
        ]}
        footer={
          task.tagIds.length > 0 ? (
            <Tasks6Tags context={context} item={task} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(task.id) : undefined}
        openLabel={labels.openTask(task.title)}
        title={task.title}
      />
    )
  }
