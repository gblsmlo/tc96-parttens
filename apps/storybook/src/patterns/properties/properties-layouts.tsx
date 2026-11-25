import {
  CalendarDotsIcon,
  CellSignalHighIcon,
  RadioButtonIcon,
  TagIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import {
  DateProperty,
  PersonProperty,
  PropertyCollection,
  SelectProperty,
  TagsProperty,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import type { PropertiesControls } from './properties-controls'
import {
  people,
  priorityOptions,
  statusOptions,
  tagOptions,
} from './properties-data'
import { ptBRPropertyLabels } from './properties-labels.ts'

function TaskProperties({
  ariaLabel,
  defaultVisible,
  empty,
  icons,
  labelsTrigger,
  readOnly,
  variant,
}: Readonly<PropertiesControls>) {
  const [status, setStatus] = useState<string | null>(
    empty ? null : 'inProgress',
  )
  const [priority, setPriority] = useState<string | null>(empty ? null : 'high')
  const [assignee, setAssignee] = useState<string | null>(
    empty ? null : 'person-2',
  )
  const [dueDate, setDueDate] = useState<string | null>(
    empty ? null : '2026-06-19T12:00:00.000Z',
  )
  const [tags, setTags] = useState<readonly string[]>(
    empty ? [] : ['documents'],
  )

  return (
    <PropertyCollection
      ariaLabel={ariaLabel}
      items={[
        {
          defaultVisible: defaultVisible.includes('status'),
          icon: icons ? RadioButtonIcon : undefined,
          id: 'status',
          label: 'Status',
          render: () => (
            <SelectProperty
              ariaLabel="Status"
              onValueChange={setStatus}
              options={statusOptions}
              placeholder="Set status"
              value={status}
              variant={variant}
            />
          ),
        },
        {
          defaultVisible: defaultVisible.includes('priority'),
          icon: icons ? CellSignalHighIcon : undefined,
          id: 'priority',
          label: 'Priority',
          render: () => (
            <SelectProperty
              ariaLabel="Priority"
              onValueChange={setPriority}
              options={priorityOptions}
              placeholder="Set priority"
              value={priority}
              variant={variant}
            />
          ),
        },
        {
          defaultVisible: defaultVisible.includes('assignee'),
          icon: icons ? UserCircleIcon : undefined,
          id: 'assignee',
          label: 'Assignee',
          render: () => (
            <PersonProperty
              ariaLabel="Assignee"
              onValueChange={setAssignee}
              options={people}
              placeholder="Set assignee"
              value={assignee}
              variant={variant}
            />
          ),
        },
        {
          defaultVisible: defaultVisible.includes('dueDate'),
          icon: icons ? CalendarDotsIcon : undefined,
          id: 'dueDate',
          label: 'Due date',
          render: () => (
            <DateProperty
              ariaLabel="Due date"
              locale="en-US"
              onValueChange={setDueDate}
              timeZone="UTC"
              value={dueDate}
              variant={variant}
              labels={ptBRPropertyLabels.date}
            />
          ),
        },
        {
          defaultVisible: defaultVisible.includes('tags'),
          icon: icons ? TagIcon : undefined,
          id: 'tags',
          label: 'Tags',
          render: () => (
            <TagsProperty
              ariaLabel="Tags"
              onValueChange={setTags}
              options={tagOptions}
              placeholder="Add tag"
              value={tags}
              variant={variant}
              labels={ptBRPropertyLabels.tags}
            />
          ),
        },
      ]}
      readOnly={readOnly}
      labels={{ ...ptBRPropertyLabels.collection, trigger: labelsTrigger }}
    />
  )
}

export function ComposedProperties(args: Readonly<PropertiesControls>) {
  return (
    <TaskProperties
      key={`${args.defaultVisible.join()}:${args.empty}`}
      {...args}
    />
  )
}

export function PlainPropertyColumn() {
  const [status, setStatus] = useState<string | null>('inProgress')
  const [dueDate, setDueDate] = useState<string | null>(null)

  return (
    <dl className="grid w-80 grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 text-sm">
      <dt className="text-muted-foreground">Status</dt>
      <dd className="flex min-w-0 items-center" data-row="status">
        <SelectProperty
          ariaLabel="Status"
          onValueChange={setStatus}
          options={statusOptions}
          value={status}
          variant="plain"
        />
      </dd>
      <dt className="text-muted-foreground">Priority</dt>
      <dd className="flex min-w-0 items-center" data-row="priority">
        <SelectProperty
          ariaLabel="Priority"
          options={priorityOptions}
          readOnly
          value="high"
          variant="plain"
        />
      </dd>
      <dt className="text-muted-foreground">Due date</dt>
      <dd className="flex min-w-0 items-center" data-row="due-date">
        <DateProperty
          ariaLabel="Due date"
          onValueChange={setDueDate}
          timeZone="UTC"
          value={dueDate}
          variant="plain"
          labels={{ ...ptBRPropertyLabels.date, fallback: 'Set due date' }}
        />
      </dd>
      <dt className="text-muted-foreground">Assignee</dt>
      <dd className="flex min-w-0 items-center" data-row="assignee">
        <PersonProperty
          placeholder="Sem responsável"
          ariaLabel="Assignee"
          options={people}
          readOnly
          value="person-2"
          variant="plain"
        />
      </dd>
    </dl>
  )
}
