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
  Tasks5AssigneesField,
  Tasks5DueField,
  type Tasks5FieldContext,
  Tasks5PriorityMark,
  Tasks5ProjectField,
  Tasks5StatusMark,
  Tasks5Tags,
  Tasks5TagsField,
  Tasks5UpdatedField,
} from './tasks-5-fields'
import { tasks5FieldWidth, tasks5LeadingWidth } from './tasks-5-options'
import type {
  Tasks5Labels,
  Tasks5Sort,
  Tasks5SortColumn,
  Tasks5SortDirection,
  Tasks5Task,
} from './types'

export interface Tasks5ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface Tasks5ListHeaderProps {
  labels: Tasks5Labels
  selection?: Tasks5ListHeaderSelection
  onSort?: (column: Tasks5SortColumn) => void
  sort: Tasks5Sort
  sortDirection: Tasks5SortDirection
}

export function Tasks5ListHeader({
  labels,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Tasks5ListHeaderProps>) {
  const sortable = (column: Tasks5SortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort ? labels.sortColumn(column, direction) : undefined,
    }
  }

  return (
    <ListViewHeader data-slot="tasks-5-list-header">
      <ListViewHeaderCell
        always
        className={cn(tasks5LeadingWidth, '-me-0.5 ps-1')}
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
      <ListViewHeaderCell className={tasks5FieldWidth.tags}>
        {labels.columns.tags}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        always
        className={tasks5FieldWidth.due}
        {...sortable('due')}
      >
        {labels.columns.due}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks5FieldWidth.project}
        {...sortable('project')}
      >
        {labels.columns.project}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={tasks5FieldWidth.assignees}>
        {labels.columns.assignees}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks5FieldWidth.updated}
        {...sortable('updated')}
      >
        {labels.columns.updated}
      </ListViewHeaderCell>
    </ListViewHeader>
  )
}

export const renderTasks5ListRow =
  (context: Tasks5FieldContext) => (task: Tasks5Task) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
    const selected = selectedIds.has(task.id)
    return (
      <ListRow
        data-slot="tasks-5-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(tasks5LeadingWidth, '-me-0.5 ps-1')}>
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
            <Tasks5PriorityMark context={context} item={task} />
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
                leading={<Tasks5StatusMark context={context} item={task} />}
                variant="plain"
              />
            </ListRowTitle>
          </ListRowHeader>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField className={tasks5FieldWidth.tags}>
            <Tasks5TagsField context={context} item={task} />
          </ListRowField>
          <ListRowField always className={tasks5FieldWidth.due}>
            <Tasks5DueField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks5FieldWidth.project}>
            <Tasks5ProjectField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks5FieldWidth.assignees}>
            <Tasks5AssigneesField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks5FieldWidth.updated}>
            <Tasks5UpdatedField context={context} item={task} />
          </ListRowField>
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks5KanbanCard =
  (context: Tasks5FieldContext) => (task: Tasks5Task) => {
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
            value: <Tasks5DueField context={context} item={task} />,
          },
          {
            id: 'assignees',
            interactive: Boolean(onAssigneesChange),
            label: labels.columns.assignees,
            value: <Tasks5AssigneesField context={context} item={task} />,
          },
        ]}
        footer={
          task.tagIds.length > 0 ? (
            <Tasks5Tags context={context} item={task} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(task.id) : undefined}
        openLabel={labels.openTask(task.title)}
        title={task.title}
      />
    )
  }
