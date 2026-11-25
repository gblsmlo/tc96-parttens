import { ptBR } from '@daypicker/react/locale'
import { CircleIcon, CubeIcon } from '@phosphor-icons/react'
import {
  calendarDateFromDate,
  calendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import { dayOffsetInTimeZone, formatShortDate } from '@tc96/ui/helpers/date'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { PeopleProperty } from '@tc96/ui/patterns/properties/display/people/people-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import {
  PropertyMetaIcon,
  priorityMeta,
  propertyToneClassName,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import { cn } from '@tc96/utils'
import { dataPriorities } from '../../shared/properties/data-priority'
import { DataOwner } from '../../shared/properties/data-properties'
import { tasks2VisibleTags } from './tasks-2-options'
import type {
  Tasks2Labels,
  Tasks2Option,
  Tasks2Person,
  Tasks2Tag,
  Tasks2Task,
} from './types'

export interface Tasks2FieldContext {
  labels: Tasks2Labels
  locale: string
  now: Date
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onOpen?: (taskId: string) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onSelectedChange?: (taskId: string, selected: boolean) => void
  people: readonly Tasks2Person[]
  projects: readonly Tasks2Option[]
  selectedIds: ReadonlySet<string>
  tagById: ReadonlyMap<string, Tasks2Tag>
  timeZone: string
}

interface FieldProps {
  context: Tasks2FieldContext
  item: Tasks2Task
}

const serializeDay = (date: Date) => calendarDateKey(calendarDateFromDate(date))

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateDisplayOf = (value: string | null, timeZone: string) =>
  value && calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }

export const findTasks2Priority = (value: string | null) =>
  dataPriorities.find((priority) => priority === value) ?? null

export function Tasks2PriorityMark({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <span className="flex size-4 items-center" data-slot="tasks-2-priority">
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

export function Tasks2StatusMark({ context, item }: FieldProps) {
  return (
    <span className="flex size-4 items-center" data-slot="tasks-2-status">
      <PropertyMetaIcon
        className="size-4"
        meta={workflowStatusMeta[item.status]}
      />
      <span className="sr-only">{context.labels.statuses[item.status]}</span>
    </span>
  )
}

export function Tasks2Tags({ context, item }: FieldProps) {
  const { labels, tagById } = context
  const resolved = item.tagIds.flatMap((id) => {
    const tag = tagById.get(id)
    return tag ? [tag] : []
  })
  if (resolved.length === 0) return null
  const hidden = resolved.length - tasks2VisibleTags
  return (
    <span className="flex min-w-0 items-center gap-1" data-slot="tasks-2-tags">
      {resolved.slice(0, tasks2VisibleTags).map((tag) => (
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

export function Tasks2DueField({ context, item }: FieldProps) {
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

export function Tasks2ProjectField({ context, item }: FieldProps) {
  const { labels, onProjectChange, projects } = context
  return (
    <SelectProperty
      allowEmpty={Boolean(onProjectChange)}
      ariaLabel={labels.columns.project}
      labels={{ emptyOption: labels.noProject }}
      onValueChange={
        onProjectChange
          ? (projectId) => {
              if (projectId !== item.projectId)
                onProjectChange(item.id, projectId)
            }
          : undefined
      }
      options={projects.map((project) => ({
        icon: CubeIcon,
        label: project.label,
        tone: 'neutral',
        value: project.id,
      }))}
      placeholder={labels.noProject}
      value={item.projectId}
      variant="plain"
    />
  )
}

export function Tasks2AssigneesField({ context, item }: FieldProps) {
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

export function formatTasks2Updated(
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

export function Tasks2UpdatedField({ context, item }: FieldProps) {
  const { locale, now, timeZone } = context
  return (
    <IconLabelProperty
      className="text-muted-foreground tabular-nums"
      label={
        <time dateTime={item.updatedAt}>
          {formatTasks2Updated(item.updatedAt, now, locale, timeZone)}
        </time>
      }
      variant="plain"
    />
  )
}

export function Tasks2CreatorField({ context, item }: FieldProps) {
  const { labels, people } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.creator}
      avatarOnly
      owners={people}
      placeholder={labels.noCreator}
      value={item.creatorId}
      variant="plain"
    />
  )
}
