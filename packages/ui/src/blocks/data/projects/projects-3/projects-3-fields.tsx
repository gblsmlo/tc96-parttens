import { ptBR } from '@daypicker/react/locale'
import {
  calendarDateFromDate,
  calendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import {
  dataPriorities,
  dataPriorityAppearance,
} from '../../shared/properties/data-priority'
import {
  DataOwner,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import {
  projects3StatusAppearance,
  projects3Statuses,
} from './projects-3-options'
import type {
  Projects3Labels,
  Projects3Option,
  Projects3Person,
  Projects3Priority,
  Projects3Status,
  Projects3Task,
} from './types'

export interface Projects3FieldContext {
  assignees: readonly Projects3Person[]
  labels: Projects3Labels
  locale: string
  onAssigneeChange?: (taskId: string, assigneeId: string) => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onOpen?: (taskId: string) => void
  onPriorityChange?: (
    taskId: string,
    priority: Projects3Priority | null,
  ) => void
  onStartChange?: (taskId: string, startAt: string) => void
  onStatusChange?: (taskId: string, status: Projects3Status) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  onTypeChange?: (taskId: string, type: string) => void
  tags: readonly Projects3Option[]
  tagsLoading: boolean
  timeZone: string
  types: readonly Projects3Option[]
}

interface FieldProps {
  context: Projects3FieldContext
  item: Projects3Task
  variant?: DataPropertyVariant
}

const serializeDay = (date: Date) => calendarDateKey(calendarDateFromDate(date))

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateDisplayOf = (value: string | null, timeZone: string) =>
  value && calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }

const findPriority = (value: string | null): Projects3Priority | null =>
  dataPriorities.find((priority) => priority === value) ?? null

export function Projects3TypeField({ context, item, variant }: FieldProps) {
  const { labels, onTypeChange, types } = context
  return (
    <DataSelect<string>
      ariaLabel={labels.columns.type}
      onChange={
        onTypeChange
          ? (type) => {
              if (type !== item.type) onTypeChange(item.id, type)
            }
          : undefined
      }
      options={types.map((type) => ({ label: type.label, value: type.id }))}
      value={item.type}
      variant={variant}
    />
  )
}

export function Projects3StatusField({ context, item, variant }: FieldProps) {
  const { labels, onStatusChange } = context
  return (
    <DataSelect<Projects3Status>
      ariaLabel={labels.columns.status}
      onChange={
        onStatusChange
          ? (status) => {
              if (status !== item.status) onStatusChange(item.id, status)
            }
          : undefined
      }
      options={dataSelectOptions(
        projects3Statuses,
        labels.statuses,
        projects3StatusAppearance,
      )}
      value={item.status}
      variant={variant}
    />
  )
}

export function Projects3PriorityField({ context, item, variant }: FieldProps) {
  const { labels, onPriorityChange } = context
  return (
    <SelectProperty
      ariaLabel={labels.columns.priority}
      onValueChange={
        onPriorityChange
          ? (value) => {
              const priority = findPriority(value)
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
      variant={variant}
      allowEmpty={Boolean(onPriorityChange)}
      labels={{ emptyOption: labels.noPriority }}
    />
  )
}

export function Projects3AssigneeField({ context, item, variant }: FieldProps) {
  const { assignees, labels, onAssigneeChange } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.assignee}
      onChange={
        onAssigneeChange
          ? (assigneeId) => {
              if (assigneeId !== item.assigneeId)
                onAssigneeChange(item.id, assigneeId)
            }
          : undefined
      }
      owners={assignees}
      placeholder={labels.unassigned}
      value={item.assigneeId}
      variant={variant}
    />
  )
}

export function Projects3StartField({ context, item, variant }: FieldProps) {
  const { labels, locale, onStartChange, timeZone } = context
  return (
    <DateProperty
      allowClear={false}
      ariaLabel={labels.columns.start}
      calendarLocale={ptBR}
      locale={locale}
      onValueChange={
        onStartChange
          ? (startAt) => {
              if (startAt) onStartChange(item.id, startAt)
            }
          : undefined
      }
      readOnly={!onStartChange}
      serializeDate={serializeDay}
      {...dateDisplayOf(item.startAt, timeZone)}
      variant={variant}
      labels={{ fallback: labels.noStart }}
    />
  )
}

export function Projects3DueField({ context, item, variant }: FieldProps) {
  const { labels, locale, onDueChange, timeZone } = context
  return (
    <DateProperty
      ariaLabel={labels.columns.due}
      calendarLocale={ptBR}
      isOverdue={Boolean(item.overdue)}
      locale={locale}
      onValueChange={
        onDueChange ? (dueAt) => onDueChange(item.id, dueAt) : undefined
      }
      readOnly={!onDueChange}
      serializeDate={serializeDay}
      {...dateDisplayOf(item.dueAt, timeZone)}
      variant={variant}
      labels={{ clear: labels.clearDate, fallback: labels.noDue }}
    />
  )
}

export function Projects3TagsField({ context, item, variant }: FieldProps) {
  const { labels, onTagsChange, tags, tagsLoading } = context
  const options = tags.map((tag) => ({ label: tag.label, value: tag.id }))
  if (!onTagsChange) {
    const selected = options.filter((option) =>
      item.tagIds.includes(option.value),
    )
    if (selected.length === 0) return null
    return (
      <TagsProperty
        ariaLabel={labels.columns.tags}
        options={selected}
        readOnly
        value={selected.map((option) => option.value)}
        variant={variant ?? 'badge'}
      />
    )
  }
  return (
    <TagsProperty
      ariaLabel={labels.columns.tags}
      isLoading={tagsLoading}
      labels={labels.tagPicker}
      onValueChange={(tagIds) => onTagsChange(item.id, [...tagIds])}
      options={options}
      placeholder={labels.noTags}
      value={item.tagIds}
      variant={variant}
    />
  )
}

export function Projects3ArchivedMark({
  context,
  item,
}: Readonly<{ context: Projects3FieldContext; item: Projects3Task }>) {
  if (!item.archived) return null
  return (
    <span
      className="shrink-0 text-muted-foreground text-xs"
      data-slot="projects-3-archived"
    >
      {context.labels.archived}
    </span>
  )
}
