import { ptBR } from '@daypicker/react/locale'
import {
  CircleIcon,
  FolderIcon,
  type Icon as PhosphorIcon,
  ScalesIcon,
} from '@phosphor-icons/react'
import {
  calendarDateFromDate,
  calendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import {
  dayOffsetInTimeZone,
  formatShortDate,
  parseIsoDate,
} from '@tc96/ui/helpers/date'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@tc96/ui/menu'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { PeopleProperty } from '@tc96/ui/patterns/properties/display/people/people-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { PropertySurface } from '@tc96/ui/patterns/properties/shared/property-surface'
import {
  PropertyMetaIcon,
  priorityMeta,
  propertyToneClassName,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { dataPriorities } from '../../shared/properties/data-priority'
import { tasks6VisibleTags } from './tasks-6-options'
import type {
  Tasks6FieldId,
  Tasks6Labels,
  Tasks6Option,
  Tasks6Person,
  Tasks6Priority,
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
  onPriorityChange?: (taskId: string, priority: Tasks6Priority | null) => void
  onProjectChange?: (taskId: string, projectId: string | null) => void
  onSelectedChange?: (taskId: string, selected: boolean) => void
  onStartChange?: (taskId: string, day: string) => void
  onStatusChange?: (taskId: string, status: Tasks6Status) => void
  onTypeChange?: (taskId: string, typeId: string) => void
  people: readonly Tasks6Person[]
  projects: readonly Tasks6Option[]
  selectedIds: ReadonlySet<string>
  statusById: ReadonlyMap<string, Tasks6StatusOption>
  statuses: readonly Tasks6StatusOption[]
  tagById: ReadonlyMap<string, Tasks6Tag>
  timeZone: string
  types: readonly Tasks6Option[]
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

const editHandler = <THandler,>(
  item: Tasks6Task,
  handler: THandler | undefined,
): THandler | undefined => (item.readOnly ? undefined : handler)

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

export function Tasks6StatusMark({ context, item }: FieldProps) {
  const status = context.statusById.get(item.status)
  return (
    <span className="flex size-4 items-center" data-slot="tasks-6-status">
      <PropertyMetaIcon
        className="size-4"
        meta={status?.meta ?? workflowStatusMeta.todo}
      />
      <span className="sr-only">{status?.label ?? item.status}</span>
    </span>
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
    <span className="flex min-w-0 items-center gap-1" data-slot="tasks-6-tags">
      {resolved.slice(0, tasks6VisibleTags).map((tag) => (
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

export function Tasks6StatusField({ context, item }: FieldProps) {
  const { labels, statuses } = context
  const onStatusChange = editHandler(item, context.onStatusChange)
  return (
    <SelectProperty
      ariaLabel={labels.columns.status}
      onValueChange={
        onStatusChange
          ? (status) => {
              if (status && status !== item.status)
                onStatusChange(item.id, status)
            }
          : undefined
      }
      options={statuses.map((status) => ({
        icon: status.meta.icon,
        label: status.label,
        tone: status.meta.tone,
        value: status.id,
        weight: status.meta.weight,
      }))}
      readOnly={!onStatusChange}
      value={item.status}
      variant="plain"
    />
  )
}

export function Tasks6PriorityField({ context, item }: FieldProps) {
  const { labels } = context
  const onPriorityChange = editHandler(item, context.onPriorityChange)
  return (
    <SelectProperty
      allowEmpty={Boolean(onPriorityChange)}
      ariaLabel={labels.columns.priority}
      labels={{ emptyOption: labels.noPriority }}
      onValueChange={
        onPriorityChange
          ? (value) => {
              const priority = findTasks6Priority(value)
              if (priority !== item.priority)
                onPriorityChange(item.id, priority)
            }
          : undefined
      }
      options={dataPriorities.map((priority) => ({
        icon: priorityMeta[priority].icon,
        label: labels.priorities[priority],
        tone: priorityMeta[priority].tone,
        value: priority,
        weight: priorityMeta[priority].weight,
      }))}
      placeholder={labels.noPriority}
      readOnly={!onPriorityChange}
      value={item.priority}
      variant="plain"
    />
  )
}

export function Tasks6TypeField({ context, item }: FieldProps) {
  const { labels, types } = context
  const onTypeChange = editHandler(item, context.onTypeChange)
  return (
    <SelectProperty
      ariaLabel={labels.columns.type}
      onValueChange={
        onTypeChange
          ? (typeId) => {
              if (typeId && typeId !== item.typeId)
                onTypeChange(item.id, typeId)
            }
          : undefined
      }
      options={types.map((type) => ({ label: type.label, value: type.id }))}
      placeholder={labels.noType}
      readOnly={!onTypeChange}
      value={item.typeId ?? null}
      variant="plain"
    />
  )
}

export function Tasks6StartField({ context, item }: FieldProps) {
  const { labels, locale, timeZone } = context
  const onStartChange = editHandler(item, context.onStartChange)
  return (
    <DateProperty
      allowClear={false}
      ariaLabel={labels.columns.start}
      calendarLocale={ptBR}
      locale={locale}
      onValueChange={
        onStartChange
          ? (day) => {
              if (day) onStartChange(item.id, day)
            }
          : undefined
      }
      readOnly={!onStartChange}
      serializeDate={serializeDay}
      {...dateDisplayOf(item.startAt ?? null, timeZone)}
      variant="plain"
      labels={{ clear: labels.clearDate, fallback: labels.noStart }}
    />
  )
}

export function Tasks6DueField({ context, item }: FieldProps) {
  const { labels, locale, timeZone } = context
  const onDueChange = editHandler(item, context.onDueChange)
  const display = dateDisplayOf(item.dueAt, timeZone)
  const dueDate = item.overdue ? parseIsoDate(display.value) : null
  return (
    <DateProperty
      ariaLabel={labels.columns.due}
      calendarLocale={ptBR}
      className={item.overdue ? 'text-warning-foreground' : undefined}
      displayLabel={
        dueDate
          ? labels.overdue(formatShortDate(dueDate, locale, display.timeZone))
          : undefined
      }
      isOverdue={Boolean(item.overdue)}
      locale={locale}
      onValueChange={
        onDueChange ? (dueAt) => onDueChange(item.id, dueAt) : undefined
      }
      readOnly={!onDueChange}
      serializeDate={serializeDay}
      {...display}
      variant="plain"
      labels={{ clear: labels.clearDate, fallback: labels.noDue }}
    />
  )
}

const linkIcon = (id: string): PhosphorIcon =>
  id.startsWith('matter:') ? FolderIcon : ScalesIcon

const projectGroups = (projects: readonly Tasks6Option[]) => {
  const groups: { label: string; options: Tasks6Option[] }[] = []
  for (const project of projects) {
    if (!project.group) continue
    const group = groups.find((item) => item.label === project.group)
    if (group) group.options.push(project)
    else groups.push({ label: project.group, options: [project] })
  }
  return groups
}

export function Tasks6ProjectField({ context, item }: FieldProps) {
  const { labels, projects } = context
  const onProjectChange = editHandler(item, context.onProjectChange)
  const projectId = item.projectId ?? null
  const groups = projectGroups(projects)
  const selected = projects.find((project) => project.id === projectId)
  const change = (next: string | null) => {
    if (onProjectChange && next !== projectId) onProjectChange(item.id, next)
  }

  if (!onProjectChange || groups.length === 0) {
    return (
      <SelectProperty
        allowEmpty={Boolean(onProjectChange)}
        ariaLabel={labels.columns.project}
        labels={{ emptyOption: labels.noProject }}
        onValueChange={onProjectChange ? change : undefined}
        options={projects.map((project) => ({
          icon: linkIcon(project.id),
          label: project.label,
          tone: 'neutral',
          value: project.id,
        }))}
        placeholder={labels.noProject}
        value={projectId}
        variant="plain"
      />
    )
  }

  const Icon = selected ? linkIcon(selected.id) : undefined
  const label = selected?.label ?? labels.noProject
  return (
    <Menu>
      <MenuTrigger
        aria-label={
          selected
            ? `${labels.columns.project}: ${label}`
            : labels.columns.project
        }
        render={
          <PropertySurface
            className="max-w-full"
            muted={!selected}
            render={<button type="button" />}
            variant="plain"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {Icon ? <Icon aria-hidden className="size-4" /> : null}
          <span className="truncate">{label}</span>
        </span>
      </MenuTrigger>
      <MenuPopup align="start">
        <MenuItem onClick={() => change(null)}>{labels.noProject}</MenuItem>
        {groups.map((group) => {
          const GroupIcon = linkIcon(group.options[0]?.id ?? '')
          return (
            <MenuSub key={group.label}>
              <MenuSubTrigger>
                <GroupIcon aria-hidden="true" />
                {group.label}
              </MenuSubTrigger>
              <MenuSubPopup>
                <MenuRadioGroup
                  onValueChange={(next: string) => change(next)}
                  value={projectId}
                >
                  {group.options.map((option) => (
                    <MenuRadioItem
                      closeOnClick
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
              </MenuSubPopup>
            </MenuSub>
          )
        })}
      </MenuPopup>
    </Menu>
  )
}

export function Tasks6AssigneesField({ context, item }: FieldProps) {
  const { labels, people } = context
  const onAssigneesChange = editHandler(item, context.onAssigneesChange)
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

const fieldRenderers = {
  assignees: Tasks6AssigneesField,
  due: Tasks6DueField,
  priority: Tasks6PriorityField,
  project: Tasks6ProjectField,
  start: Tasks6StartField,
  status: Tasks6StatusField,
  type: Tasks6TypeField,
  updated: Tasks6UpdatedField,
} as const satisfies Record<Tasks6FieldId, (props: FieldProps) => ReactNode>

export function Tasks6Field({
  context,
  field,
  item,
}: Readonly<FieldProps & { field: Tasks6FieldId }>) {
  const Field = fieldRenderers[field]
  return <Field context={context} item={item} />
}

const fieldHandlers = {
  assignees: 'onAssigneesChange',
  due: 'onDueChange',
  priority: 'onPriorityChange',
  project: 'onProjectChange',
  start: 'onStartChange',
  status: 'onStatusChange',
  type: 'onTypeChange',
  updated: null,
} as const satisfies Record<Tasks6FieldId, keyof Tasks6FieldContext | null>

export const isTasks6FieldEditable = (
  context: Tasks6FieldContext,
  field: Tasks6FieldId,
  item: Tasks6Task,
) => {
  const handler = fieldHandlers[field]
  return !item.readOnly && handler !== null && Boolean(context[handler])
}
