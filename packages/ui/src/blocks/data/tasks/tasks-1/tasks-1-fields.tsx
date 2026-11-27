import { ptBR } from '@daypicker/react/locale'
import { Button } from '@tc96/ui/button'
import {
  calendarDateFromDate,
  calendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { PropertyMetaIcon, workflowStatusMeta } from '@tc96/ui/property-meta'
import type { ReactNode } from 'react'
import { DataDate } from '../../shared/properties/data-properties'
import { type TasksStatus, type TasksTask, tasksStatuses } from '../shared'
import { createTasksCells, type TasksCells } from '../shared/tasks-columns'
import type { TasksFieldContext, TasksFieldProps } from '../shared/tasks-fields'

const serializeDay = (date: Date) => calendarDateKey(calendarDateFromDate(date))

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateDisplayOf = (value: string | null, timeZone: string) =>
  value && calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }

const findStatus = (value: unknown): TasksStatus | null =>
  tasksStatuses.find((status) => status === value) ?? null

function Tasks1StatusIcon({ status }: Readonly<{ status: TasksStatus }>) {
  return (
    <PropertyMetaIcon className="size-4" meta={workflowStatusMeta[status]} />
  )
}

export function Tasks1StatusMark({ context, item }: TasksFieldProps) {
  const { labels, onStatusChange } = context
  const statusLabel = labels.statuses[item.status]
  if (!onStatusChange)
    return (
      <span
        aria-label={`${labels.status}: ${statusLabel}`}
        className="inline-flex size-7 shrink-0 items-center justify-center"
        data-slot="tasks-1-status"
        role="img"
      >
        <Tasks1StatusIcon status={item.status} />
      </span>
    )
  return (
    <Menu>
      <MenuTrigger
        aria-label={labels.changeStatus(statusLabel)}
        data-slot="tasks-1-status"
        render={<Button size="icon-sm" type="button" variant="ghost" />}
      >
        <Tasks1StatusIcon status={item.status} />
      </MenuTrigger>
      <MenuPopup align="start">
        <MenuRadioGroup
          aria-label={labels.status}
          onValueChange={(value) => {
            const status = findStatus(value)
            if (status && status !== item.status)
              onStatusChange(item.id, status)
          }}
          value={item.status}
        >
          {tasksStatuses.map((status) => (
            <MenuRadioItem key={status} value={status}>
              <Tasks1StatusIcon status={status} />
              {labels.statuses[status]}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}

export function Tasks1TagsField({ context, item }: TasksFieldProps) {
  const { labels, onTagsChange, tagById } = context
  const tags = [...tagById.values()]
  if (onTagsChange)
    return (
      <TagsProperty
        ariaLabel={labels.columns.tags}
        className="w-auto"
        labels={labels.tagPicker}
        onValueChange={(tagIds) => onTagsChange(item.id, [...tagIds])}
        options={tags.map((tag) => ({ label: tag.label, value: tag.id }))}
        value={item.tagIds}
        variant="badge"
      />
    )
  const selected = tags
    .filter((tag) => item.tagIds.includes(tag.id))
    .map((tag) => ({ label: tag.label, value: tag.id }))
  if (selected.length === 0) return null
  return (
    <TagsProperty
      ariaLabel={labels.columns.tags}
      className="flex-nowrap"
      options={selected}
      readOnly
      value={selected.map((option) => option.value)}
      variant="badge"
    />
  )
}

export function Tasks1DueField({ context, item }: TasksFieldProps) {
  const { labels, locale, onDueChange, timeZone } = context
  return (
    <DateProperty
      ariaLabel={labels.columns.due}
      calendarLocale={ptBR}
      isOverdue={Boolean(item.overdue)}
      labels={{ clear: labels.clearDate, fallback: labels.noDue }}
      locale={locale}
      onValueChange={
        onDueChange ? (dueAt) => onDueChange(item.id, dueAt) : undefined
      }
      readOnly={!onDueChange}
      serializeDate={serializeDay}
      {...dateDisplayOf(item.dueAt, timeZone)}
    />
  )
}

export function Tasks1KindField({ context, item }: TasksFieldProps) {
  const { kinds, labels, onKindChange } = context
  return (
    <SelectProperty
      allowEmpty={Boolean(onKindChange)}
      ariaLabel={labels.columns.kind}
      labels={{ emptyOption: labels.noKind }}
      onValueChange={
        onKindChange
          ? (kindId) => {
              if (kindId !== item.kindId) onKindChange(item.id, kindId)
            }
          : undefined
      }
      options={kinds.map((kind) => ({
        label: kind.label,
        value: kind.id,
      }))}
      placeholder={labels.noKind}
      value={item.kindId}
      variant="plain"
    />
  )
}

export function Tasks1UpdatedField({ context, item }: TasksFieldProps) {
  const { labels, locale, timeZone } = context
  return (
    <DataDate
      ariaLabel={labels.columns.updated}
      fallback=""
      locale={locale}
      timeZone={timeZone}
      value={item.updatedAt}
      variant="plain"
      withTime
    />
  )
}

export function createTasks1Cells(context: TasksFieldContext): TasksCells {
  const field =
    (Field: (props: TasksFieldProps) => ReactNode) => (task: TasksTask) => (
      <Field context={context} item={task} />
    )
  return {
    ...createTasksCells(context),
    due: field(Tasks1DueField),
    kind: field(Tasks1KindField),
    tags: field(Tasks1TagsField),
    title: (task) => (
      <IconLabelProperty
        className="gap-2 font-medium text-foreground"
        label={task.title}
        leading={<Tasks1StatusMark context={context} item={task} />}
        variant="plain"
      />
    ),
    updated: field(Tasks1UpdatedField),
  }
}
