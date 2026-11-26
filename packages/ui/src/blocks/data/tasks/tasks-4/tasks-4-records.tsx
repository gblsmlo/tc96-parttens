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
  Tasks4AssigneesField,
  Tasks4DueField,
  type Tasks4FieldContext,
  Tasks4PriorityMark,
  Tasks4ProjectField,
  Tasks4StatusMark,
  Tasks4Tags,
  Tasks4UpdatedField,
} from './tasks-4-fields'
import { tasks4FieldWidth, tasks4LeadingWidth } from './tasks-4-options'
import type {
  Tasks4Labels,
  Tasks4Sort,
  Tasks4SortColumn,
  Tasks4SortDirection,
  Tasks4Task,
} from './types'

export interface Tasks4ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface Tasks4ListHeaderProps {
  labels: Tasks4Labels
  selection?: Tasks4ListHeaderSelection
  onSort?: (column: Tasks4SortColumn) => void
  sort: Tasks4Sort
  sortDirection: Tasks4SortDirection
}

export function Tasks4ListHeader({
  labels,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Tasks4ListHeaderProps>) {
  const sortable = (column: Tasks4SortColumn) => {
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
      <ListViewHeaderCell
        always
        className={tasks4FieldWidth.due}
        {...sortable('due')}
      >
        {labels.columns.due}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks4FieldWidth.project}
        {...sortable('project')}
      >
        {labels.columns.project}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={tasks4FieldWidth.assignees}>
        {labels.columns.assignees}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks4FieldWidth.updated}
        {...sortable('updated')}
      >
        {labels.columns.updated}
      </ListViewHeaderCell>
    </ListViewHeader>
  )
}

export const renderTasks4ListRow =
  (context: Tasks4FieldContext) => (task: Tasks4Task) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
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
            <Tasks4PriorityMark context={context} item={task} />
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
                leading={<Tasks4StatusMark context={context} item={task} />}
                variant="plain"
              />
            </ListRowTitle>
            <span className="hidden shrink-0 md:flex">
              <Tasks4Tags context={context} item={task} />
            </span>
          </ListRowHeader>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField always className={tasks4FieldWidth.due}>
            <Tasks4DueField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks4FieldWidth.project}>
            <Tasks4ProjectField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks4FieldWidth.assignees}>
            <Tasks4AssigneesField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks4FieldWidth.updated}>
            <Tasks4UpdatedField context={context} item={task} />
          </ListRowField>
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks4KanbanCard =
  (context: Tasks4FieldContext) => (task: Tasks4Task) => {
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
            value: <Tasks4DueField context={context} item={task} />,
          },
          {
            id: 'assignees',
            interactive: Boolean(onAssigneesChange),
            label: labels.columns.assignees,
            value: <Tasks4AssigneesField context={context} item={task} />,
          },
        ]}
        footer={
          task.tagIds.length > 0 ? (
            <Tasks4Tags context={context} item={task} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(task.id) : undefined}
        openLabel={labels.openTask(task.title)}
        title={task.title}
      />
    )
  }
