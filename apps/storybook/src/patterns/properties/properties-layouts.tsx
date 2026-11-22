import {
  DateProperty,
  PersonProperty,
  PropertyCollection,
  SelectProperty,
  TagsProperty,
} from '@tc96/parttens'
import {
  CalendarDaysIcon,
  CircleDotIcon,
  SignalHighIcon,
  TagIcon,
  UserCircleIcon,
} from 'lucide-react'
import { useState } from 'react'
import type { PropertiesControls } from './properties-controls'
import {
  people,
  priorityOptions,
  statusOptions,
  tagOptions,
} from './properties-data'

function TaskProperties({
  ariaLabel,
  defaultVisible,
  empty,
  icons,
  readOnly,
  triggerLabel,
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
          icon: icons ? CircleDotIcon : undefined,
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
          icon: icons ? SignalHighIcon : undefined,
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
          icon: icons ? CalendarDaysIcon : undefined,
          id: 'dueDate',
          label: 'Due date',
          render: () => (
            <DateProperty
              ariaLabel="Due date"
              fallback="Set due date"
              locale="en-US"
              onValueChange={setDueDate}
              timeZone="UTC"
              value={dueDate}
              variant={variant}
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
            />
          ),
        },
      ]}
      readOnly={readOnly}
      triggerLabel={triggerLabel}
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

export function TaskHeader() {
  const [status, setStatus] = useState<string | null>('inProgress')
  const [priority, setPriority] = useState<string | null>('high')
  const [assignee, setAssignee] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [tags, setTags] = useState<readonly string[]>([])

  return (
    <header className="flex max-w-xl flex-col gap-2">
      <h2 className="font-semibold text-lg">Review the Acme contract</h2>
      <PropertyCollection
        ariaLabel="Task properties"
        items={[
          {
            defaultVisible: true,
            icon: CircleDotIcon,
            id: 'status',
            label: 'Status',
            render: () => (
              <SelectProperty
                ariaLabel="Status"
                onValueChange={setStatus}
                options={statusOptions}
                value={status}
              />
            ),
          },
          {
            defaultVisible: true,
            icon: SignalHighIcon,
            id: 'priority',
            label: 'Priority',
            render: () => (
              <SelectProperty
                ariaLabel="Priority"
                onValueChange={setPriority}
                options={priorityOptions}
                value={priority}
              />
            ),
          },
          {
            defaultVisible: true,
            icon: UserCircleIcon,
            id: 'assignee',
            label: 'Assignee',
            render: () => (
              <PersonProperty
                ariaLabel="Assignee"
                onValueChange={setAssignee}
                options={people}
                placeholder="Set assignee"
                value={assignee}
              />
            ),
          },
          {
            defaultVisible: true,
            icon: CalendarDaysIcon,
            id: 'dueDate',
            label: 'Due date',
            render: () => (
              <DateProperty
                ariaLabel="Due date"
                fallback="Set due date"
                locale="pt-BR"
                onValueChange={setDueDate}
                value={dueDate}
              />
            ),
          },
          {
            icon: TagIcon,
            id: 'tags',
            label: 'Tags',
            render: () => (
              <TagsProperty
                ariaLabel="Tags"
                onValueChange={setTags}
                options={tagOptions}
                value={tags}
              />
            ),
          },
        ]}
      />
    </header>
  )
}

export function LeadHeader() {
  const [status, setStatus] = useState<string | null>('todo')
  const [owner, setOwner] = useState<string | null>('person-2')
  const [nextContact, setNextContact] = useState<string | null>('2026-08-28')
  const [tags, setTags] = useState<readonly string[]>(['return'])

  return (
    <header className="flex max-w-xl flex-col gap-2">
      <h2 className="font-semibold text-lg">Marina Costa · Northwind</h2>
      <PropertyCollection
        ariaLabel="Lead properties"
        items={[
          {
            defaultVisible: true,
            icon: CircleDotIcon,
            id: 'status',
            label: 'Status',
            render: () => (
              <SelectProperty
                ariaLabel="Status"
                onValueChange={setStatus}
                options={statusOptions}
                value={status}
              />
            ),
          },
          {
            defaultVisible: true,
            icon: UserCircleIcon,
            id: 'owner',
            label: 'Dono',
            render: () => (
              <PersonProperty
                ariaLabel="Owner"
                onValueChange={setOwner}
                options={people}
                placeholder="Set owner"
                value={owner}
              />
            ),
          },
          {
            defaultVisible: true,
            icon: TagIcon,
            id: 'tags',
            label: 'Tags',
            render: () => (
              <TagsProperty
                ariaLabel="Tags"
                onValueChange={setTags}
                options={tagOptions}
                value={tags}
              />
            ),
          },
          {
            icon: CalendarDaysIcon,
            id: 'nextContact',
            label: 'Next contact',
            render: () => (
              <DateProperty
                ariaLabel="Next contact"
                fallback="Schedule contact"
                locale="pt-BR"
                onValueChange={setNextContact}
                value={nextContact}
              />
            ),
          },
        ]}
      />
    </header>
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
          fallback="Set due date"
          onValueChange={setDueDate}
          timeZone="UTC"
          value={dueDate}
          variant="plain"
        />
      </dd>
      <dt className="text-muted-foreground">Assignee</dt>
      <dd className="flex min-w-0 items-center" data-row="assignee">
        <PersonProperty
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
