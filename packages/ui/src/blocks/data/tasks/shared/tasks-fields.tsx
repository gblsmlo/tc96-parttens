import { ptBR } from '@daypicker/react/locale'
import { CircleIcon, CubeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  calendarDateFromDate,
  calendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import { dayOffsetInTimeZone, formatShortDate } from '@tc96/ui/helpers/date'
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { PeopleProperty } from '@tc96/ui/patterns/properties/display/people/people-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import {
  PropertyMetaIcon,
  priorityMeta,
  propertyToneClassName,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import { cn } from '@tc96/utils'
import {
  dataPriorities,
  dataPriorityAppearance,
} from '../../shared/properties/data-priority'
import {
  DataOwner,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import { tasksStatuses } from './options'
import type {
  TasksColumnId,
  TasksLabels,
  TasksOption,
  TasksPerson,
  TasksPriority,
  TasksStatus,
  TasksTag,
  TasksTask,
} from './types'

const tasksVisibleTags = 1

export interface TasksFieldContext {
  labels: TasksLabels
  locale: string
  now: Date
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onOpen?: (taskId: string) => void
  onKindChange?: (taskId: string, kindId: string | null) => void
  onPriorityChange?: (taskId: string, priority: TasksPriority | null) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  onSelectedChange?: (taskId: string, selected: boolean) => void
  onStatusChange?: (taskId: string, status: TasksStatus) => void
  people: readonly TasksPerson[]
  kinds: readonly TasksOption[]
  selectedIds: ReadonlySet<string>
  tagById: ReadonlyMap<string, TasksTag>
  timeZone: string
  visibleColumns: ReadonlySet<TasksColumnId>
}

export interface TasksFieldProps {
  context: TasksFieldContext
  item: TasksTask
}

const serializeDay = (date: Date) => calendarDateKey(calendarDateFromDate(date))

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateDisplayOf = (value: string | null, timeZone: string) =>
  value && calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }

export const findTasksPriority = (value: string | null): TasksPriority | null =>
  dataPriorities.find((priority) => priority === value) ?? null

export function TasksPriorityMark({ context, item }: TasksFieldProps) {
  const { labels } = context
  return (
    <span className="flex size-4 items-center" data-slot="tasks-priority">
      <PropertyMetaIcon
        className="size-4"
        meta={priorityMeta[item.priority ?? 'none']}
      />
      <span className="sr-only">
        {item.priority ? labels.priorities[item.priority] : labels.noPriority}
      </span>
    </span>
  )
}

const findTasksStatus = (value: unknown): TasksStatus | null =>
  tasksStatuses.find((status) => status === value) ?? null

function TasksStatusIcon({ status }: Readonly<{ status: TasksStatus }>) {
  return (
    <PropertyMetaIcon className="size-4" meta={workflowStatusMeta[status]} />
  )
}

export function TasksStatusMark({ context, item }: TasksFieldProps) {
  const { labels, onStatusChange } = context
  const statusLabel = labels.statuses[item.status]
  if (!onStatusChange)
    return (
      <span className="flex size-4 items-center" data-slot="tasks-status">
        <TasksStatusIcon status={item.status} />
        <span className="sr-only">{statusLabel}</span>
      </span>
    )
  return (
    <Menu>
      <MenuTrigger
        aria-label={labels.changeStatus(statusLabel)}
        className="relative z-10"
        data-slot="tasks-status"
        render={<Button size="icon-sm" type="button" variant="ghost" />}
      >
        <TasksStatusIcon status={item.status} />
      </MenuTrigger>
      <MenuPopup align="start">
        <MenuRadioGroup
          aria-label={labels.status}
          onValueChange={(value) => {
            const status = findTasksStatus(value)
            if (status && status !== item.status)
              onStatusChange(item.id, status)
          }}
          value={item.status}
        >
          {tasksStatuses.map((status) => (
            <MenuRadioItem key={status} value={status}>
              <TasksStatusIcon status={status} />
              {labels.statuses[status]}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}

export function TasksTags({ context, item }: TasksFieldProps) {
  const { labels, tagById } = context
  const resolved = item.tagIds.flatMap((id) => {
    const tag = tagById.get(id)
    return tag ? [tag] : []
  })
  if (resolved.length === 0) return null
  const hidden = resolved.length - tasksVisibleTags
  return (
    <span
      className="flex min-w-0 items-center gap-1 overflow-hidden"
      data-slot="tasks-tags"
    >
      {resolved.slice(0, tasksVisibleTags).map((tag) => (
        <IconLabelProperty
          key={tag.id}
          label={tag.label}
          leading={
            <CircleIcon
              aria-hidden="true"
              className={cn('size-2 shrink-0', propertyToneClassName[tag.tone])}
              weight="fill"
            />
          }
        />
      ))}
      {hidden > 0 ? (
        <IconLabelProperty label={labels.moreTags(hidden)} />
      ) : null}
    </span>
  )
}

export function TasksTagsField({ context, item }: TasksFieldProps) {
  const { labels, onTagsChange, tagById } = context
  if (!onTagsChange) return <TasksTags context={context} item={item} />
  const first = item.tagIds
    .slice(0, tasksVisibleTags)
    .flatMap((id) => tagById.get(id) ?? [])
  return (
    <span
      className="flex min-w-0 items-center gap-1 overflow-hidden"
      data-slot="tasks-tags"
    >
      {first.map((tag) => (
        <IconLabelProperty
          key={tag.id}
          label={tag.label}
          leading={
            <CircleIcon
              aria-hidden="true"
              className={cn('size-2 shrink-0', propertyToneClassName[tag.tone])}
              weight="fill"
            />
          }
        />
      ))}
      <TagsProperty
        ariaLabel={labels.columns.tags}
        display="count"
        labels={labels.tagPicker}
        onValueChange={(tagIds) => onTagsChange(item.id, [...tagIds])}
        options={[...tagById.values()].map((tag) => ({
          label: tag.label,
          value: tag.id,
        }))}
        value={item.tagIds}
        variant="badge"
      />
    </span>
  )
}

export function TasksDueField({ context, item }: TasksFieldProps) {
  const { labels, locale, onDueChange, timeZone } = context
  return (
    <DateProperty
      ariaLabel={labels.columns.due}
      calendarLocale={ptBR}
      className={item.overdue ? 'text-warning-foreground' : undefined}
      isOverdue={Boolean(item.overdue)}
      locale={locale}
      onValueChange={
        onDueChange ? (dueAt) => onDueChange(item.id, dueAt) : undefined
      }
      readOnly={!onDueChange}
      serializeDate={serializeDay}
      {...dateDisplayOf(item.dueAt, timeZone)}
      variant="plain"
      labels={{ clear: labels.clearDate, fallback: labels.noDue }}
    />
  )
}

export function TasksKindField({ context, item }: TasksFieldProps) {
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
        icon: CubeIcon,
        label: kind.label,
        tone: 'neutral',
        value: kind.id,
      }))}
      placeholder={labels.noKind}
      value={item.kindId}
      variant="plain"
    />
  )
}

export function TasksAssigneesField({ context, item }: TasksFieldProps) {
  const { labels, onAssigneesChange, people } = context
  return (
    <PeopleProperty
      ariaLabel={labels.columns.assignees}
      display="stack"
      labels={labels.peoplePicker}
      onValueChange={
        onAssigneesChange
          ? (assigneeIds) => onAssigneesChange(item.id, [...assigneeIds])
          : undefined
      }
      options={people.map((person) => ({
        imageUrl: person.imageUrl,
        label: person.label,
        value: person.id,
      }))}
      placeholder={labels.unassigned}
      readOnly={!onAssigneesChange}
      value={item.assigneeIds}
      variant="plain"
    />
  )
}

const timeFormatters = new Map<string, Intl.DateTimeFormat>()

function formatTime(date: Date, locale: string, timeZone: string) {
  const key = `${locale}|${timeZone}`
  let formatter = timeFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone,
    })
    timeFormatters.set(key, formatter)
  }
  return formatter.format(date)
}

export function formatTasksUpdated(
  value: string,
  now: Date,
  locale: string,
  timeZone: string,
): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return dayOffsetInTimeZone(now, date, timeZone) === 0
    ? formatTime(date, locale, timeZone)
    : formatShortDate(date, locale, timeZone)
}

export function TasksUpdatedField({ context, item }: TasksFieldProps) {
  const { locale, now, timeZone } = context
  return (
    <IconLabelProperty
      className="text-muted-foreground tabular-nums"
      label={
        <time dateTime={item.updatedAt}>
          {formatTasksUpdated(item.updatedAt, now, locale, timeZone)}
        </time>
      }
      variant="plain"
    />
  )
}

export function TasksPriorityField({ context, item }: TasksFieldProps) {
  const { labels, onPriorityChange } = context
  return (
    <SelectProperty
      allowEmpty={Boolean(onPriorityChange)}
      ariaLabel={labels.columns.priority}
      labels={{ emptyOption: labels.noPriority }}
      onValueChange={
        onPriorityChange
          ? (value) => {
              const priority = findTasksPriority(value)
              if (priority !== item.priority)
                onPriorityChange(item.id, priority)
            }
          : undefined
      }
      options={dataSelectOptions(
        dataPriorities,
        labels.priorities,
        dataPriorityAppearance,
      )}
      placeholder={labels.noPriority}
      value={item.priority}
    />
  )
}

export function TasksStatusField({ context, item }: TasksFieldProps) {
  return (
    <IconLabelProperty
      className="gap-2"
      label={context.labels.statuses[item.status]}
      leading={<TasksStatusMark context={context} item={item} />}
      variant="plain"
    />
  )
}

export function TasksCreatorField({ context, item }: TasksFieldProps) {
  const { labels, people } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.creator}
      owners={people}
      placeholder={labels.noCreator}
      value={item.creatorId}
      variant="plain"
    />
  )
}
