import { Checkbox } from '@tc96/ui/checkbox'
import {
  ListRow,
  ListRowBody,
  ListRowDescription,
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
  isTasks6FieldEditable,
  Tasks6Field,
  type Tasks6FieldContext,
  Tasks6PriorityMark,
  Tasks6StatusMark,
  Tasks6Tags,
} from './tasks-6-fields'
import {
  tasks6AlwaysVisibleFields,
  tasks6FieldWidth,
  tasks6LeadingWidth,
  tasks6Sorts,
} from './tasks-6-options'
import type {
  Tasks6FieldId,
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
  fields: readonly Tasks6FieldId[]
  labels: Tasks6Labels
  selection?: Tasks6ListHeaderSelection
  onSort?: (column: Tasks6SortColumn) => void
  sort: Tasks6Sort
  sortDirection: Tasks6SortDirection
}

const isSortColumn = (value: string): value is Tasks6SortColumn =>
  tasks6Sorts.some((sort) => sort === value)

export function Tasks6ListHeader({
  fields,
  labels,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Tasks6ListHeaderProps>) {
  const sortable = (column: string) => {
    if (!onSort || !isSortColumn(column)) return {}
    const direction = sort === column ? sortDirection : null
    return {
      onSort: () => onSort(column),
      sortDirection: direction,
      sortLabel: labels.sortColumn(column, direction),
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
      {fields.map((field) => (
        <ListViewHeaderCell
          always={tasks6AlwaysVisibleFields.includes(field)}
          className={tasks6FieldWidth[field]}
          key={field}
          {...sortable(field)}
        >
          {labels.columns[field]}
        </ListViewHeaderCell>
      ))}
    </ListViewHeader>
  )
}

function Tasks6ListMark({
  context,
  fields,
  task,
}: Readonly<{
  context: Tasks6FieldContext
  fields: readonly Tasks6FieldId[]
  task: Tasks6Task
}>) {
  if (!fields.includes('priority'))
    return <Tasks6PriorityMark context={context} item={task} />
  if (!fields.includes('status'))
    return <Tasks6StatusMark context={context} item={task} />
  return null
}

export const renderTasks6ListRow =
  (context: Tasks6FieldContext, fields: readonly Tasks6FieldId[]) =>
  (task: Tasks6Task) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
    const selected = selectedIds.has(task.id)
    const mark = (
      <Tasks6ListMark context={context} fields={fields} task={task} />
    )
    const showsMark = !(
      fields.includes('priority') && fields.includes('status')
    )
    return (
      <ListRow
        data-slot="tasks-6-row"
        data-task-id={task.id}
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(tasks6LeadingWidth, '-me-0.5 ps-1')}>
          {onSelectedChange ? (
            <ListRowSelect
              aria-label={labels.selectTask(task.title)}
              checked={selected}
              className={showsMark ? undefined : 'me-0'}
              onCheckedChange={(checked) =>
                onSelectedChange(task.id, checked === true)
              }
            >
              {showsMark ? mark : null}
            </ListRowSelect>
          ) : (
            mark
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
                leading={
                  fields.includes('status') ? undefined : (
                    <Tasks6StatusMark context={context} item={task} />
                  )
                }
                variant="plain"
              />
            </ListRowTitle>
            <span className="hidden shrink-0 md:flex">
              <Tasks6Tags context={context} item={task} />
            </span>
          </ListRowHeader>
          {task.description ? (
            <ListRowDescription className="truncate">
              {task.description}
            </ListRowDescription>
          ) : null}
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          {fields.map((field) => (
            <ListRowField
              always={tasks6AlwaysVisibleFields.includes(field)}
              className={tasks6FieldWidth[field]}
              key={field}
            >
              <Tasks6Field context={context} field={field} item={task} />
            </ListRowField>
          ))}
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderTasks6KanbanCard =
  (context: Tasks6FieldContext, fields: readonly Tasks6FieldId[]) =>
  (task: Tasks6Task) => {
    const { labels, onOpen, projects } = context
    const project = projects.find((item) => item.id === task.projectId)
    return (
      <DataCollectionKanbanCard
        caption={[task.description, project?.label].flatMap((part) =>
          part ? [part] : [],
        )}
        fields={fields.map((field) => ({
          id: field,
          interactive: isTasks6FieldEditable(context, field, task),
          label: labels.columns[field],
          value: <Tasks6Field context={context} field={field} item={task} />,
        }))}
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
