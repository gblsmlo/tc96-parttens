import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  PersonProperty,
  type PersonPropertyOption,
  RecordGroup,
  RecordGroupRow,
  SelectProperty,
  type SelectPropertyOption,
  TagsProperty,
  type TagsPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import {
  CalendarDaysIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CirclePauseIcon,
  HashIcon,
  ShapesIcon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { recordGroupArgTypes } from '../../../test-utils/story-arg-types'
import { part, rowsOf } from './fixtures/group-dom'

const statusOptions: SelectPropertyOption[] = [
  {
    icon: CircleDotIcon,
    label: 'In progress',
    tone: 'info',
    value: 'progress',
  },
  { icon: CirclePauseIcon, label: 'On hold', tone: 'warning', value: 'hold' },
  { icon: CircleCheckIcon, label: 'Done', tone: 'success', value: 'done' },
]

const assigneeOptions: PersonPropertyOption[] = [
  { label: 'Mariana Souza', value: 'mariana' },
  { label: 'Daniel Costa', value: 'daniel' },
]

const labelOptions: TagsPropertyOption[] = [
  { label: 'Compliance', value: 'compliance' },
  { label: 'Customer', value: 'customer' },
  { label: 'Urgent', value: 'urgent' },
]

const meta = {
  argTypes: recordGroupArgTypes,
  args: {
    children: (
      <>
        <RecordGroupRow label="Title" leading={<HashIcon aria-hidden />}>
          <TextProperty
            ariaLabel="Title"
            value="Quarterly access review"
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Status" leading={<ShapesIcon aria-hidden />}>
          <SelectProperty
            ariaLabel="Status"
            options={statusOptions}
            readOnly
            value="progress"
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Assignee" leading={<UserIcon aria-hidden />}>
          <PersonProperty
            ariaLabel="Assignee"
            options={assigneeOptions}
            readOnly
            value="mariana"
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Labels" leading={<ShapesIcon aria-hidden />}>
          <TagsProperty
            ariaLabel="Labels"
            options={labelOptions}
            readOnly
            value={['compliance']}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Due" leading={<CalendarDaysIcon aria-hidden />}>
          <DateProperty
            ariaLabel="Due date"
            locale="en-US"
            readOnly
            timeZone="UTC"
            value="2026-10-21T12:00:00.000Z"
            variant="plain"
          />
        </RecordGroupRow>
      </>
    ),
    title: 'Properties',
  },
  component: RecordGroup,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Rows whose value is a `properties` component, read-only or editable. Editability belongs to the value, so `RecordGroupRow` stays presentation.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Properties',
} satisfies Meta<typeof RecordGroup>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const controlSelector =
  'button, a[href], input, textarea, select, [role="combobox"], [role="textbox"]'

export const ReadOnlyProperties: Story = {}

export const ReadOnlyPropertiesInteraction: Story = {
  ...ReadOnlyProperties,
  play: async ({ canvasElement }) => {
    const rows = rowsOf(canvasElement)

    expect(rows).toHaveLength(5)
    expect(rows.map((row) => part(row, 'label').tagName)).toEqual(
      Array(5).fill('DT'),
    )
    for (const row of rows) {
      expect(part(row, 'value').querySelector(controlSelector)).toBeNull()
    }
    const valueIcons = rows.flatMap((row) => [
      ...part(row, 'value').querySelectorAll('[data-slot="property-icon"]'),
    ])
    expect(valueIcons.length).toBeGreaterThan(0)
    for (const icon of valueIcons) {
      expect(getComputedStyle(icon).display).toBe('none')
    }
    for (const row of rows) {
      expect(part(row, 'label').querySelector('svg')).not.toBeNull()
    }
    expect(
      within(canvasElement).getByText('Quarterly access review'),
    ).toBeVisible()
    expect(within(canvasElement).getByText('In progress')).toBeVisible()
  },
  tags: interaction,
}

export const EditableProperties: Story = {
  render: function EditableProperties(args) {
    const [title, setTitle] = useState<string | null>('Quarterly access review')
    const [status, setStatus] = useState<string | null>('progress')
    const [assignee, setAssignee] = useState<string | null>('mariana')
    const [due, setDue] = useState<string | null>('2026-10-21T12:00:00.000Z')
    const [labels, setLabels] = useState<readonly string[]>(['compliance'])

    return (
      <RecordGroup {...args}>
        <RecordGroupRow label="Title" leading={<HashIcon aria-hidden />}>
          <TextProperty
            ariaLabel="Title"
            editing="inline"
            onCommit={setTitle}
            value={title}
          />
        </RecordGroupRow>
        <RecordGroupRow label="Status" leading={<ShapesIcon aria-hidden />}>
          <SelectProperty
            ariaLabel="Status"
            onValueChange={setStatus}
            options={statusOptions}
            value={status}
          />
        </RecordGroupRow>
        <RecordGroupRow label="Assignee" leading={<UserIcon aria-hidden />}>
          <PersonProperty
            ariaLabel="Assignee"
            onValueChange={setAssignee}
            options={assigneeOptions}
            value={assignee}
          />
        </RecordGroupRow>
        <RecordGroupRow label="Labels" leading={<ShapesIcon aria-hidden />}>
          <TagsProperty
            ariaLabel="Labels"
            onValueChange={setLabels}
            options={labelOptions}
            value={labels}
          />
        </RecordGroupRow>
        <RecordGroupRow label="Due" leading={<CalendarDaysIcon aria-hidden />}>
          <DateProperty
            ariaLabel="Due date"
            locale="en-US"
            onValueChange={setDue}
            timeZone="UTC"
            value={due}
          />
        </RecordGroupRow>
      </RecordGroup>
    )
  },
}

const centerOf = (element: HTMLElement) => {
  const box = element.getBoundingClientRect()
  return box.top + box.height / 2
}

const expectAligned = (canvasElement: HTMLElement) => {
  const rows = rowsOf(canvasElement)
  const startRows = rows.filter(
    (row) => row.getAttribute('data-align') === 'start',
  )

  expect(
    new Set(
      startRows.map((row) => part(row, 'label').getBoundingClientRect().width),
    ).size,
  ).toBe(1)
  for (const row of rows) {
    const box = row.getBoundingClientRect()
    const label = part(row, 'label')
    const value = part(row, 'value')

    expect(value.getBoundingClientRect().right).toBeLessThanOrEqual(
      box.right + 0.5,
    )
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    expect(Math.abs(centerOf(label) - centerOf(value))).toBeLessThanOrEqual(3)
  }
}

export const EditablePropertiesInteraction: Story = {
  ...EditableProperties,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [, statusRow, assigneeRow] = rowsOf(canvasElement) as HTMLElement[]

    expectAligned(canvasElement)
    for (const row of rowsOf(canvasElement)) {
      expect(part(row, 'value').tagName).toBe('DD')
      expect(part(row, 'value').querySelector(controlSelector)).not.toBeNull()
    }
    expect(
      within(part(statusRow as HTMLElement, 'value')).getByRole('combobox', {
        name: /^Status/,
      }),
    ).toBeVisible()

    const title = canvas.getByRole('textbox', { name: 'Title' })
    await userEvent.clear(title)
    await userEvent.type(title, 'Access review, final')
    await userEvent.tab()
    await waitFor(() =>
      expect(canvas.getByRole('textbox', { name: 'Title' })).toHaveValue(
        'Access review, final',
      ),
    )

    await userEvent.click(canvas.getByRole('combobox', { name: /^Status/ }))
    await userEvent.click(await screen.findByRole('option', { name: /Done/ }))
    await waitFor(() =>
      expect(
        within(part(statusRow as HTMLElement, 'value')).getByText('Done'),
      ).toBeVisible(),
    )

    await userEvent.click(canvas.getByRole('combobox', { name: /^Assignee/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: /Daniel Costa/ }),
    )
    await waitFor(() =>
      expect(
        within(part(assigneeRow as HTMLElement, 'value')).getByText(
          'Daniel Costa',
        ),
      ).toBeVisible(),
    )

    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    expectAligned(canvasElement)
  },
  tags: interaction,
}
