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
  Tasks2AssigneesField,
  Tasks2DueField,
  type Tasks2FieldContext,
  Tasks2PriorityMark,
  Tasks2ProjectField,
  Tasks2StatusMark,
  Tasks2Tags,
  Tasks2UpdatedField,
} from './tasks-2-fields'
import { tasks2FieldWidth, tasks2LeadingWidth } from './tasks-2-options'
import type {
  Tasks2Labels,
  Tasks2Sort,
  Tasks2SortColumn,
  Tasks2SortDirection,
  Tasks2Task,
} from './types'

export interface Tasks2ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface Tasks2ListHeaderProps {
  labels: Tasks2Labels
  selection?: Tasks2ListHeaderSelection
  onSort?: (column: Tasks2SortColumn) => void
  sort: Tasks2Sort
  sortDirection: Tasks2SortDirection
}

export function Tasks2ListHeader({
  labels,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Tasks2ListHeaderProps>) {
  const sortable = (column: Tasks2SortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort
        ? labels.sortColumn(labels.columns[column], direction)
        : undefined,
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
      <ListViewHeaderCell
        always
        className={tasks2FieldWidth.due}
        {...sortable('due')}
      >
        {labels.columns.due}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks2FieldWidth.project}
        {...sortable('project')}
      >
        {labels.columns.project}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={tasks2FieldWidth.assignees}>
        {labels.columns.assignees}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks2FieldWidth.updated}
        {...sortable('updated')}
      >
        {labels.columns.updated}
      </ListViewHeaderCell>
    </ListViewHeader>
  )
}

export const renderTasks2ListRow =
  (context: Tasks2FieldContext) => (task: Tasks2Task) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
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
              onCheckedChange={(checked) =>
                onSelectedChange(task.id, checked === true)
              }
            >
              <Tasks2PriorityMark context={context} item={task} />
            </ListRowSelect>
          ) : (
            <Tasks2PriorityMark context={context} item={task} />
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
                leading={<Tasks2StatusMark context={context} item={task} />}
                variant="plain"
              />
            </ListRowTitle>
            <span className="hidden shrink-0 md:flex">
              <Tasks2Tags context={context} item={task} />
            </span>
          </ListRowHeader>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField always className={tasks2FieldWidth.due}>
            <Tasks2DueField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks2FieldWidth.project}>
            <Tasks2ProjectField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks2FieldWidth.assignees}>
            <Tasks2AssigneesField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks2FieldWidth.updated}>
            <Tasks2UpdatedField context={context} item={task} />
          </ListRowField>
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks2KanbanCard =
  (context: Tasks2FieldContext) => (task: Tasks2Task) => {
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
            value: <Tasks2DueField context={context} item={task} />,
          },
          {
            id: 'assignees',
            interactive: Boolean(onAssigneesChange),
            label: labels.columns.assignees,
            value: <Tasks2AssigneesField context={context} item={task} />,
          },
        ]}
        footer={
          task.tagIds.length > 0 ? (
            <Tasks2Tags context={context} item={task} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(task.id) : undefined}
        openLabel={labels.openTask(task.title)}
        title={task.title}
      />
    )
  }
