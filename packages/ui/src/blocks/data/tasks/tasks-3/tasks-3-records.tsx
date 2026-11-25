import { UserPlusIcon } from '@phosphor-icons/react'
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
  Tasks3AssigneesField,
  Tasks3CreatorField,
  Tasks3DueField,
  type Tasks3FieldContext,
  Tasks3PriorityMark,
  Tasks3ProjectField,
  Tasks3StatusMark,
  Tasks3Tags,
  Tasks3UpdatedField,
} from './tasks-3-fields'
import { tasks3FieldWidth, tasks3LeadingWidth } from './tasks-3-options'
import type {
  Tasks3Labels,
  Tasks3Sort,
  Tasks3SortColumn,
  Tasks3SortDirection,
  Tasks3Task,
} from './types'

export interface Tasks3ListHeaderProps {
  labels: Tasks3Labels
  onSort?: (column: Tasks3SortColumn) => void
  sort: Tasks3Sort
  sortDirection: Tasks3SortDirection
}

export function Tasks3ListHeader({
  labels,
  onSort,
  sort,
  sortDirection,
}: Readonly<Tasks3ListHeaderProps>) {
  const sortable = (column: Tasks3SortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort ? labels.sortColumn(column, direction) : undefined,
    }
  }

  return (
    <ListViewHeader data-slot="tasks-3-list-header">
      <ListViewHeaderCell
        always
        className={cn(tasks3LeadingWidth, '-me-0.5')}
      />
      <ListViewHeaderCell always className="flex-1" {...sortable('title')}>
        {labels.columns.title}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        always
        className={tasks3FieldWidth.due}
        {...sortable('due')}
      >
        {labels.columns.due}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks3FieldWidth.project}
        {...sortable('project')}
      >
        {labels.columns.project}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={tasks3FieldWidth.assignees}>
        {labels.columns.assignees}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={tasks3FieldWidth.updated}
        {...sortable('updated')}
      >
        {labels.columns.updated}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={cn(tasks3FieldWidth.creator, 'justify-center')}
      >
        <UserPlusIcon aria-hidden="true" className="size-4" />
        <span className="sr-only">{labels.columns.creator}</span>
      </ListViewHeaderCell>
    </ListViewHeader>
  )
}

export const renderTasks3ListRow =
  (context: Tasks3FieldContext) => (task: Tasks3Task) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
    const selected = selectedIds.has(task.id)
    return (
      <ListRow
        data-slot="tasks-3-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(tasks3LeadingWidth, '-me-0.5 ps-1')}>
          {onSelectedChange ? (
            <ListRowSelect
              aria-label={labels.selectTask(task.title)}
              checked={selected}
              onCheckedChange={(checked) =>
                onSelectedChange(task.id, checked === true)
              }
            >
              <Tasks3PriorityMark context={context} item={task} />
            </ListRowSelect>
          ) : (
            <Tasks3PriorityMark context={context} item={task} />
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
                leading={<Tasks3StatusMark context={context} item={task} />}
                variant="plain"
              />
            </ListRowTitle>
            <span className="hidden shrink-0 md:flex">
              <Tasks3Tags context={context} item={task} />
            </span>
          </ListRowHeader>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField always className={tasks3FieldWidth.due}>
            <Tasks3DueField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks3FieldWidth.project}>
            <Tasks3ProjectField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks3FieldWidth.assignees}>
            <Tasks3AssigneesField context={context} item={task} />
          </ListRowField>
          <ListRowField className={tasks3FieldWidth.updated}>
            <Tasks3UpdatedField context={context} item={task} />
          </ListRowField>
          <ListRowField
            className={cn(tasks3FieldWidth.creator, 'justify-center')}
          >
            <Tasks3CreatorField context={context} item={task} />
          </ListRowField>
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks3KanbanCard =
  (context: Tasks3FieldContext) => (task: Tasks3Task) => {
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
            value: <Tasks3DueField context={context} item={task} />,
          },
          {
            id: 'assignees',
            interactive: Boolean(onAssigneesChange),
            label: labels.columns.assignees,
            value: <Tasks3AssigneesField context={context} item={task} />,
          },
        ]}
        footer={
          task.tagIds.length > 0 ? (
            <Tasks3Tags context={context} item={task} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(task.id) : undefined}
        openLabel={labels.openTask(task.title)}
        title={task.title}
      />
    )
  }
