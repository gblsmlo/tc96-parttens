import { ptBR } from '@daypicker/react/locale'
import { Button } from '@tc96/ui/button'
import {
  calendarDateFromDate,
  calendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import { propertyToneClassName } from '@tc96/ui/lib/property-tone'
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { PeopleProperty } from '@tc96/ui/patterns/properties/display/people/people-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { cn } from '@tc96/utils'
import {
  dataPriorities,
  dataPriorityAppearance,
} from '../../shared/properties/data-priority'
import {
  DataDate,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import { tasks1StatusAppearance, tasks1Statuses } from './tasks-1-options'
import type {
  Tasks1Labels,
  Tasks1Option,
  Tasks1Person,
  Tasks1Priority,
  Tasks1Status,
  Tasks1Task,
} from './types'

export interface Tasks1FieldContext {
  assignees: readonly Tasks1Person[]
  labels: Tasks1Labels
  locale: string
  onAssigneesChange?: (taskId: string, assigneeIds: string[]) => void
  onDueChange?: (taskId: string, dueAt: string | null) => void
  onPriorityChange?: (taskId: string, priority: Tasks1Priority | null) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onStatusChange?: (taskId: string, status: Tasks1Status) => void
  onTagsChange?: (taskId: string, tagIds: string[]) => void
  projects: readonly Tasks1Option[]
  tags: readonly Tasks1Option[]
  timeZone: string
}

interface FieldProps {
  context: Tasks1FieldContext
  item: Tasks1Task
}

const serializeDay = (date: Date) => calendarDateKey(calendarDateFromDate(date))

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateDisplayOf = (value: string | null, timeZone: string) =>
  value && calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }

const findPriority = (value: string | null): Tasks1Priority | null =>
  dataPriorities.find((priority) => priority === value) ?? null

const findStatus = (value: unknown): Tasks1Status | null =>
  tasks1Statuses.find((status) => status === value) ?? null

function Tasks1StatusIcon({ status }: Readonly<{ status: Tasks1Status }>) {
  const { icon: Icon, tone } = tasks1StatusAppearance[status]
  return (
    <Icon
      aria-hidden="true"
      className={cn('size-4 shrink-0', propertyToneClassName[tone])}
    />
  )
}

export function Tasks1StatusMark({ context, item }: FieldProps) {
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
          {tasks1Statuses.map((status) => (
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

export function Tasks1TagsField({ context, item }: FieldProps) {
  const { labels, onTagsChange, tags } = context
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

export function Tasks1DueField({ context, item }: FieldProps) {
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

export function Tasks1ProjectField({ context, item }: FieldProps) {
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
        label: project.label,
        value: project.id,
      }))}
      placeholder={labels.noProject}
      value={item.projectId}
      variant="plain"
    />
  )
}

export function Tasks1AssigneesField({ context, item }: FieldProps) {
  const { assignees, labels, onAssigneesChange } = context
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
      options={assignees.map((assignee) => ({
        imageUrl: assignee.imageUrl,
        label: assignee.label,
        value: assignee.id,
      }))}
      placeholder={labels.unassigned}
      readOnly={!onAssigneesChange}
      value={item.assigneeIds}
      variant="plain"
    />
  )
}

export function Tasks1PriorityField({ context, item }: FieldProps) {
  const { labels, onPriorityChange } = context
  return (
    <SelectProperty
      allowEmpty={Boolean(onPriorityChange)}
      ariaLabel={labels.columns.priority}
      labels={{ emptyOption: labels.noPriority }}
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
    />
  )
}

export function Tasks1UpdatedField({ context, item }: FieldProps) {
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
