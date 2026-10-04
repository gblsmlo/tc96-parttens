import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  PersonProperty,
  PropertyCollection,
  SelectProperty,
  type SelectPropertyOption,
  TagsProperty,
} from '@tc96/parttens'
import {
  CalendarDaysIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  CircleSlashIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
  TagIcon,
  UserCircleIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'

const people = [
  { label: 'Bruno Lima', value: 'person-1' },
  { label: 'Ana Souza', value: 'person-2' },
] as const

const tagOptions = [
  { label: 'Documents', value: 'documents' },
  { label: 'Follow-up', value: 'return' },
] as const

const statusOptions: readonly SelectPropertyOption[] = [
  { icon: CircleIcon, label: 'To do', tone: 'neutral', value: 'todo' },
  {
    icon: CircleDotIcon,
    label: 'In progress',
    tone: 'info',
    value: 'inProgress',
  },
  { icon: CircleCheckIcon, label: 'Done', tone: 'success', value: 'done' },
  {
    icon: CircleSlashIcon,
    label: 'Canceled',
    tone: 'neutral',
    value: 'canceled',
  },
]

const priorityOptions: readonly SelectPropertyOption[] = [
  { icon: SignalHighIcon, label: 'High', tone: 'danger', value: 'high' },
  { icon: SignalMediumIcon, label: 'Medium', tone: 'warning', value: 'medium' },
  { icon: SignalLowIcon, label: 'Low', tone: 'neutral', value: 'low' },
]

const meta = {
  argTypes: {
    readOnly: booleanArgType,
  },
  component: PropertyCollection,
  parameters: {
    docs: {
      description: {
        component:
          'Property row of a collection with a visibility preference. The catalog (which properties exist, in what order and which are default) belongs to the collection (Tasks, Leads, Campaigns...); the `…` trigger opens the menu listing the whole catalog so the user can add or remove properties from the row. A visible empty property shows its own fill-in affordance; a hidden one is omitted. Toggling does not reorder: position follows the catalog order.',
      },
    },
  },
  title: 'Patterns/Properties/Groups',
} satisfies Meta<typeof PropertyCollection>

export default meta

type Story = StoryObj<typeof PropertyCollection>

function TaskCollectionExample({
  readOnly = false,
}: Readonly<{ readOnly?: boolean }>) {
  const [status, setStatus] = useState<string | null>('inProgress')
  const [priority, setPriority] = useState<string | null>('high')
  const [assignee, setAssignee] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [tags, setTags] = useState<readonly string[]>([])

  return (
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
      readOnly={readOnly}
    />
  )
}

function LeadCollectionExample() {
  const [status, setStatus] = useState<string | null>('todo')
  const [owner, setOwner] = useState<string | null>('person-2')
  const [nextContact, setNextContact] = useState<string | null>('2026-08-28')
  const [tags, setTags] = useState<readonly string[]>(['return'])

  return (
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
  )
}

export const Task: Story = {
  play: async ({ canvas }) => {
    const group = await canvas.findByRole('group', {
      name: 'Task properties',
    })

    await expect(group.textContent).toContain('In progress')
    await expect(group.textContent).toContain('Set assignee')
    await expect(canvas.queryByLabelText('Tags')).toBe(null)
    await expect(
      canvas.getByRole('button', { name: 'Ajustar propriedades' }),
    ).toBeTruthy()
  },
  parameters: {
    docs: {
      description: {
        story:
          'Visible defaults with two empty ones (assignee and due date) showing the Property own affordance; tags only enter through the trigger.',
      },
    },
  },
  render: (args) => <TaskCollectionExample readOnly={args.readOnly} />,
}

export const Lead: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Same pattern, different catalog: the per-collection registry decides which properties exist, their order and the defaults.',
      },
    },
  },
  render: () => <LeadCollectionExample />,
}

export const ReadOnly: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Ajustar propriedades' }),
    ).toBe(null)
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without the preference trigger the row shows only the visible ones.',
      },
    },
  },
  render: () => <TaskCollectionExample readOnly />,
}

export const NoDefaults: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Ajustar propriedades' }),
    )

    // The popup is portaled outside the canvas, so the menu is queried from the document.
    const menu = within(await screen.findByRole('menu'))
    const options = menu.getAllByRole('menuitemcheckbox')
    await expect(
      options.map((option) => option.getAttribute('aria-checked')),
    ).toEqual(['false', 'false'])
  },
  render: () => (
    <PropertyCollection
      ariaLabel="Properties"
      items={[
        {
          icon: CircleDotIcon,
          id: 'status',
          label: 'Status',
          render: () => (
            <SelectProperty
              ariaLabel="Status"
              options={statusOptions}
              readOnly
              value="todo"
            />
          ),
        },
        {
          icon: CalendarDaysIcon,
          id: 'dueDate',
          label: 'Due date',
          render: () => (
            <DateProperty
              ariaLabel="Due date"
              fallback="Set due date"
              locale="pt-BR"
              readOnly
              value={null}
            />
          ),
        },
      ]}
    />
  ),
}
