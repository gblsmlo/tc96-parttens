import { ptBR } from '@daypicker/react/locale'
import { CircleIcon, CubeIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import {
  calendarDateFromDate,
  calendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import { dayOffsetInTimeZone, formatShortDate } from '@tc96/ui/helpers/date'
import { IconFrame } from '@tc96/ui/icon-frame'
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
} from '@tc96/ui/property-meta'
import { cn } from '@tc96/utils'
import { dataPriorities } from '../../shared/properties/data-priority'
import { tasks6VisibleTags } from './tasks-6-options'
import type {
  Tasks6Labels,
  Tasks6Option,
  Tasks6Person,
  Tasks6Status,
  Tasks6StatusOption,
  Tasks6Tag,
  Tasks6Task,
} from './types'

export interface Tasks6FieldContext {
  labels: Tasks6Labels
  locale: string
  now: Date
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onOpen?: (taskId: string) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  onSelectedChange?: (taskId: string, selected: boolean) => void
  onStatusChange?: (taskId: string, status: Tasks6Status) => void
  people: readonly Tasks6Person[]
  projects: readonly Tasks6Option[]
  selectedIds: ReadonlySet<string>
  statuses: readonly Tasks6StatusOption[]
  tagById: ReadonlyMap<string, Tasks6Tag>
  timeZone: string
}

interface FieldProps {
  context: Tasks6FieldContext
  item: Tasks6Task
}

const serializeDay = (date: Date) => calendarDateKey(calendarDateFromDate(date))

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateDisplayOf = (value: string | null, timeZone: string) =>
  value && calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }

export const findTasks6Priority = (value: string | null) =>
  dataPriorities.find((priority) => priority === value) ?? null

export function Tasks6PriorityMark({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <span className="flex size-4 items-center" data-slot="tasks-6-priority">
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

function Tasks6StatusFrame({
  status,
}: Readonly<{ status: Tasks6StatusOption | undefined }>) {
  return (
    <IconFrame shape="rounded" size="xs" variant="plain">
      {status ? (
        <PropertyMetaIcon className="size-4" meta={status.meta} />
      ) : null}
    </IconFrame>
  )
}

export function Tasks6StatusMark({ context, item }: FieldProps) {
  const { labels, onStatusChange, statuses } = context
  const current = statuses.find((status) => status.id === item.status)
  const statusLabel = current?.label ?? item.status
  if (!onStatusChange)
    return (
      <span className="flex items-center" data-slot="tasks-6-status">
        <Tasks6StatusFrame status={current} />
        <span className="sr-only">{statusLabel}</span>
      </span>
    )
  return (
    <Menu>
      <MenuTrigger
        aria-label={labels.changeStatus(statusLabel)}
        className="relative z-10 flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        data-slot="tasks-6-status"
        render={<button type="button" />}
      >
        <Tasks6StatusFrame status={current} />
      </MenuTrigger>
      <MenuPopup align="start">
        <MenuRadioGroup
          aria-label={labels.status}
          onValueChange={(value: Tasks6Status) => {
            if (value !== item.status) onStatusChange(item.id, value)
          }}
          value={item.status}
        >
          {statuses.map((status) => (
            <MenuRadioItem key={status.id} value={status.id}>
              <PropertyMetaIcon className="size-4" meta={status.meta} />
              {status.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}

function Tasks6TagBadge({ tag }: Readonly<{ tag: Tasks6Tag }>) {
  return (
    <Badge className="min-w-0" variant="outline">
      <CircleIcon
        aria-hidden="true"
        className={cn('size-2 shrink-0', propertyToneClassName[tag.tone])}
        weight="fill"
      />
      <span className="truncate">{tag.label}</span>
    </Badge>
  )
}

export function Tasks6Tags({ context, item }: FieldProps) {
  const { labels, tagById } = context
  const resolved = item.tagIds.flatMap((id) => {
    const tag = tagById.get(id)
    return tag ? [tag] : []
  })
  if (resolved.length === 0) return null
  const hidden = resolved.length - tasks6VisibleTags
  return (
    <span
      className="flex min-w-0 items-center gap-1 overflow-hidden"
      data-slot="tasks-6-tags"
    >
      {resolved.slice(0, tasks6VisibleTags).map((tag) => (
        <Tasks6TagBadge key={tag.id} tag={tag} />
      ))}
      {hidden > 0 ? (
        <Badge variant="outline">{labels.moreTags(hidden)}</Badge>
      ) : null}
    </span>
  )
}

export function Tasks6TagsField({ context, item }: FieldProps) {
  const { labels, onTagsChange, tagById } = context
  if (!onTagsChange) return <Tasks6Tags context={context} item={item} />
  const first = item.tagIds
    .slice(0, tasks6VisibleTags)
    .flatMap((id) => tagById.get(id) ?? [])
  return (
    <span
      className="flex min-w-0 items-center gap-1 overflow-hidden"
      data-slot="tasks-6-tags"
    >
      {first.map((tag) => (
        <Tasks6TagBadge key={tag.id} tag={tag} />
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

export function Tasks6DueField({ context, item }: FieldProps) {
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

export function Tasks6ProjectField({ context, item }: FieldProps) {
  const { labels, onProjectChange, projects } = context
  return (
    <SelectProperty
      allowEmpty={Boolean(onProjectChange)}
      ariaLabel={labels.columns.project}
      labels={{ emptyOption: labels.noProject }}
      onValueChange={
        onProjectChange
          ? (projectId) => {
              if (projectId !== (item.projectId ?? null))
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
      value={item.projectId ?? null}
      variant="plain"
    />
  )
}

export function Tasks6AssigneesField({ context, item }: FieldProps) {
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

export function formatTasks6Updated(
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

export function Tasks6UpdatedField({ context, item }: FieldProps) {
  const { locale, now, timeZone } = context
  if (!item.updatedAt) return null
  return (
    <IconLabelProperty
      className="text-muted-foreground tabular-nums"
      label={
        <time dateTime={item.updatedAt}>
          {formatTasks6Updated(item.updatedAt, now, locale, timeZone)}
        </time>
      }
      variant="plain"
    />
  )
}
