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
import {
  PropertyMetaIcon,
  priorityMeta,
  propertyToneClassName,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import { cn } from '@tc96/utils'
import { dataPriorities } from '../../shared/properties/data-priority'
import { tasks4Statuses, tasks4VisibleTags } from './tasks-4-options'
import type {
  Tasks4Labels,
  Tasks4Option,
  Tasks4Person,
  Tasks4Status,
  Tasks4Tag,
  Tasks4Task,
} from './types'

export interface Tasks4FieldContext {
  labels: Tasks4Labels
  locale: string
  now: Date
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onOpen?: (taskId: string) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onSelectedChange?: (taskId: string, selected: boolean) => void
  onStatusChange?: (taskId: string, status: Tasks4Status) => void
  people: readonly Tasks4Person[]
  projects: readonly Tasks4Option[]
  selectedIds: ReadonlySet<string>
  tagById: ReadonlyMap<string, Tasks4Tag>
  timeZone: string
}

interface FieldProps {
  context: Tasks4FieldContext
  item: Tasks4Task
}

const serializeDay = (date: Date) => calendarDateKey(calendarDateFromDate(date))

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateDisplayOf = (value: string | null, timeZone: string) =>
  value && calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }

export const findTasks4Priority = (value: string | null) =>
  dataPriorities.find((priority) => priority === value) ?? null

export function Tasks4PriorityMark({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <span className="flex size-4 items-center" data-slot="tasks-4-priority">
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

const findTasks4Status = (value: unknown): Tasks4Status | null =>
  tasks4Statuses.find((status) => status === value) ?? null

function Tasks4StatusIcon({ status }: Readonly<{ status: Tasks4Status }>) {
  return (
    <PropertyMetaIcon className="size-4" meta={workflowStatusMeta[status]} />
  )
}

export function Tasks4StatusMark({ context, item }: FieldProps) {
  const { labels, onStatusChange } = context
  const statusLabel = labels.statuses[item.status]
  if (!onStatusChange)
    return (
      <span className="flex size-4 items-center" data-slot="tasks-4-status">
        <Tasks4StatusIcon status={item.status} />
        <span className="sr-only">{statusLabel}</span>
      </span>
    )
  return (
    <Menu>
      <MenuTrigger
        aria-label={labels.changeStatus(statusLabel)}
        className="relative z-10"
        data-slot="tasks-4-status"
        render={<Button size="icon-sm" type="button" variant="ghost" />}
      >
        <Tasks4StatusIcon status={item.status} />
      </MenuTrigger>
      <MenuPopup align="start">
        <MenuRadioGroup
          aria-label={labels.status}
          onValueChange={(value) => {
            const status = findTasks4Status(value)
            if (status && status !== item.status)
              onStatusChange(item.id, status)
          }}
          value={item.status}
        >
          {tasks4Statuses.map((status) => (
            <MenuRadioItem key={status} value={status}>
              <Tasks4StatusIcon status={status} />
              {labels.statuses[status]}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}

export function Tasks4Tags({ context, item }: FieldProps) {
  const { labels, tagById } = context
  const resolved = item.tagIds.flatMap((id) => {
    const tag = tagById.get(id)
    return tag ? [tag] : []
  })
  if (resolved.length === 0) return null
  const hidden = resolved.length - tasks4VisibleTags
  return (
    <span className="flex min-w-0 items-center gap-1" data-slot="tasks-4-tags">
      {resolved.slice(0, tasks4VisibleTags).map((tag) => (
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

export function Tasks4DueField({ context, item }: FieldProps) {
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

export function Tasks4ProjectField({ context, item }: FieldProps) {
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

export function Tasks4AssigneesField({ context, item }: FieldProps) {
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

export function formatTasks4Updated(
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

export function Tasks4UpdatedField({ context, item }: FieldProps) {
  const { locale, now, timeZone } = context
  return (
    <IconLabelProperty
      className="text-muted-foreground tabular-nums"
      label={
        <time dateTime={item.updatedAt}>
          {formatTasks4Updated(item.updatedAt, now, locale, timeZone)}
        </time>
      }
      variant="plain"
    />
  )
}
