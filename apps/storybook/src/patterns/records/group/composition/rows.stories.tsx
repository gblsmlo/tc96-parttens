import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  PersonProperty,
  type PersonPropertyOption,
  RecordGroup,
  RecordGroupRow,
  type RecordGroupRowAlign,
  type RecordGroupVariant,
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
  TagIcon,
  UserIcon,
} from 'lucide-react'
import { type ComponentType, useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import {
  booleanArgType,
  recordGroupArgTypes,
} from '../../../../test-utils/story-arg-types'
import { part, rowsOf } from '../fixtures/group-dom'
import { IconSlot, Slot } from '../fixtures/slot'

interface RowsArgs {
  align: RecordGroupRowAlign
  editable: boolean
  leading: boolean
  variant: RecordGroupVariant
}

const hidden = { table: { disable: true } } as const
const longLabel =
  'Expected delivery date agreed with the customer after the second review'
const longValue =
  'Mariana de Souza Albuquerque Figueiredo e Silva, Customer Success Department'

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

const usage = `
import { RecordGroup, RecordGroupRow, SelectProperty, TextProperty } from '@acme/patterns'

<RecordGroup title="Properties">
  <RecordGroupRow label="Title" leading={<HashIcon aria-hidden="true" />}>
    <TextProperty ariaLabel="Title" editing="inline" onCommit={setTitle} value={title} />
  </RecordGroupRow>
  <RecordGroupRow align="between" label="Status" leading={<ShapesIcon aria-hidden="true" />}>
    <SelectProperty ariaLabel="Status" onValueChange={setStatus} options={statusOptions} value={status} />
  </RecordGroupRow>
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'A label and its value, rendered as its own `dl` with a `dt` and a `dd`, so a screen reader pairs them. `align` is `start` (the default: a fixed 112px label column shared by every row) or `between` (the label takes what the value leaves, up to 144px, and truncates first). `leading` puts an icon on the label and hides every `[data-slot=property-icon]` in the value. The value is usually a `properties` component in `plain`; editability belongs to it, so the row stays presentation.',
      name: 'RecordGroupRow',
    },
  ],
  description: {
    component:
      '`RecordGroupRow` fills a `RecordGroup` with label and value pairs. `Anatomy` shows the slots of a row (`leading`, `label`, `children`), driven by the controls. `Usage` is a properties group, read-only or editable through the `editable` control. `Behavior` is under test: `start` rows share one label column and truncate a long label, `between` rows keep the value at the end and never overflow, and editing a value keeps the rows aligned.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const labelText = (row: HTMLElement) =>
  part(row, 'label').lastElementChild as HTMLElement

const centerOf = (element: HTMLElement) => {
  const box = element.getBoundingClientRect()
  return box.top + box.height / 2
}

function PropertiesGroup({
  align,
  editable,
  leading,
  variant,
}: Readonly<RowsArgs>) {
  const [title, setTitle] = useState<string | null>('Quarterly access review')
  const [status, setStatus] = useState<string | null>('progress')
  const [assignee, setAssignee] = useState<string | null>('mariana')
  const [labels, setLabels] = useState<readonly string[]>(['compliance'])
  const [due, setDue] = useState<string | null>('2026-10-21T12:00:00.000Z')
  const readOnly = !editable
  const look = editable ? undefined : 'plain'

  return (
    <RecordGroup title="Properties" variant={variant}>
      <RecordGroupRow
        align={align}
        label="Title"
        leading={leading ? <HashIcon aria-hidden /> : undefined}
      >
        <TextProperty
          ariaLabel="Title"
          {...(editable ? { editing: 'inline' as const } : {})}
          onCommit={setTitle}
          value={title}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Status"
        leading={leading ? <ShapesIcon aria-hidden /> : undefined}
      >
        <SelectProperty
          ariaLabel="Status"
          onValueChange={setStatus}
          options={statusOptions}
          readOnly={readOnly}
          value={status}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Assignee"
        leading={leading ? <UserIcon aria-hidden /> : undefined}
      >
        <PersonProperty
          ariaLabel="Assignee"
          onValueChange={setAssignee}
          options={assigneeOptions}
          readOnly={readOnly}
          value={assignee}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Labels"
        leading={leading ? <TagIcon aria-hidden /> : undefined}
      >
        <TagsProperty
          ariaLabel="Labels"
          onValueChange={setLabels}
          options={labelOptions}
          readOnly={readOnly}
          value={labels}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Due"
        leading={leading ? <CalendarDaysIcon aria-hidden /> : undefined}
      >
        <DateProperty
          ariaLabel="Due date"
          locale="en-US"
          onValueChange={setDue}
          readOnly={readOnly}
          timeZone="UTC"
          value={due}
          variant={look}
        />
      </RecordGroupRow>
    </RecordGroup>
  )
}

function RowsBehavior() {
  const [title, setTitle] = useState<string | null>('Quarterly access review')
  const [status, setStatus] = useState<string | null>('progress')

  return (
    <div className="flex flex-col gap-6">
      <RecordGroup title="Request">
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
        <RecordGroupRow label="Due" leading={<CalendarDaysIcon aria-hidden />}>
          <DateProperty readOnly value="2026-10-21" variant="plain" />
        </RecordGroupRow>
        <RecordGroupRow
          label={longLabel}
          leading={<CalendarDaysIcon aria-hidden />}
        >
          <DateProperty readOnly value="2026-10-21" variant="plain" />
        </RecordGroupRow>
      </RecordGroup>
      <RecordGroup title="Customer">
        <RecordGroupRow
          align="between"
          label="Type"
          leading={<ShapesIcon aria-hidden />}
        >
          <TextProperty value="Document request" variant="plain" />
        </RecordGroupRow>
        <RecordGroupRow
          align="between"
          label={longLabel}
          leading={<CalendarDaysIcon aria-hidden />}
        >
          <DateProperty readOnly value="2026-10-21" variant="plain" />
        </RecordGroupRow>
        <RecordGroupRow
          align="between"
          label="Owner"
          leading={<UserIcon aria-hidden />}
        >
          <TextProperty value={longValue} variant="plain" />
        </RecordGroupRow>
      </RecordGroup>
    </div>
  )
}

const expectStartRows = async (region: HTMLElement) => {
  const rows = rowsOf(region)
  const widths = rows.map(
    (row) => part(row, 'label').getBoundingClientRect().width,
  )

  await expect(new Set(widths).size).toBe(1)
  await expect(widths[0]).toBeCloseTo(112, 0)
  for (const row of rows) {
    const label = part(row, 'label')
    const value = part(row, 'value')
    await expect(value.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      label.getBoundingClientRect().right - 0.5,
    )
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    await expect(
      Math.abs(centerOf(label) - centerOf(value)),
    ).toBeLessThanOrEqual(3)
  }
}

const meta = {
  args: { align: 'start', editable: false, leading: true, variant: 'plain' },
  argTypes: {
    align: { control: 'inline-radio', options: ['between', 'start'] },
    editable: booleanArgType,
    leading: booleanArgType,
    variant: recordGroupArgTypes.variant,
  },
  component: RecordGroupRow as unknown as ComponentType<RowsArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Composition/Rows',
} satisfies Meta<RowsArgs>

export default meta

type Story = StoryObj<typeof meta>

const contract = ['!dev', '!autodocs']

const firstRow = (canvasElement: HTMLElement) =>
  rowsOf(canvasElement)[0] as HTMLElement

export const Anatomy: Story = {
  argTypes: { editable: hidden },
  play: async ({ canvasElement }) => {
    for (const row of rowsOf(canvasElement)) {
      await expect(row.tagName).toBe('DL')
      await expect(
        [...row.querySelectorAll('[data-slot^="record-group-row-"]')].map(
          (node) => node.tagName,
        ),
      ).toEqual(['DT', 'DD'])
    }
  },
  render: ({ align, leading, variant }) => (
    <RecordGroup title="Group" variant={variant}>
      {['first', 'second'].map((key) => (
        <RecordGroupRow
          align={align}
          key={key}
          label={<Slot name="label" />}
          leading={leading ? <IconSlot /> : undefined}
        >
          <Slot name="children" />
        </RecordGroupRow>
      ))}
    </RecordGroup>
  ),
}

export const Usage: Story = {
  render: (args) => <PropertiesGroup {...args} />,
}

export const Behavior: Story = {
  argTypes: {
    align: hidden,
    editable: hidden,
    leading: hidden,
    variant: hidden,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const request = canvas.getByRole('region', { name: 'Request' })
    const customer = canvas.getByRole('region', { name: 'Customer' })
    const [titleRow, statusRow, dueRow, longStartRow] = rowsOf(
      request,
    ) as HTMLElement[]

    for (const row of [titleRow, statusRow, dueRow] as HTMLElement[]) {
      const text = labelText(row)
      await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
    }
    const longStart = labelText(longStartRow as HTMLElement)
    await expect(longStart.scrollWidth).toBeGreaterThan(longStart.clientWidth)
    await expect(part(longStartRow as HTMLElement, 'value')).toHaveTextContent(
      'Oct 21',
    )
    for (const icon of part(statusRow as HTMLElement, 'value').querySelectorAll(
      '[data-slot="property-icon"]',
    )) {
      await expect(getComputedStyle(icon).display).toBe('none')
    }
    await expectStartRows(request)

    const title = within(request).getByRole('textbox', { name: 'Title' })
    await userEvent.clear(title)
    await userEvent.type(title, 'Access review, final')
    await userEvent.tab()
    await waitFor(() =>
      expect(
        within(request).getByRole('textbox', { name: 'Title' }),
      ).toHaveValue('Access review, final'),
    )
    await userEvent.click(
      within(request).getByRole('combobox', { name: /^Status/ }),
    )
    await userEvent.click(await screen.findByRole('option', { name: /Done/ }))
    await waitFor(() =>
      expect(
        within(part(statusRow as HTMLElement, 'value')).getByText('Done'),
      ).toBeVisible(),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expectStartRows(request)

    const [, longBetweenRow, longValueRow] = rowsOf(customer) as HTMLElement[]
    for (const row of rowsOf(customer)) {
      const box = row.getBoundingClientRect()
      const paddingEnd = Number.parseFloat(getComputedStyle(row).paddingRight)
      await expect(row).toHaveAttribute('data-align', 'between')
      await expect(
        Math.abs(
          part(row, 'value').getBoundingClientRect().right -
            (box.right - paddingEnd),
        ),
      ).toBeLessThan(1)
      await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    }
    const longBetween = labelText(longBetweenRow as HTMLElement)
    await expect(longBetween.scrollWidth).toBeGreaterThan(
      longBetween.clientWidth,
    )
    await expect(
      part(longBetweenRow as HTMLElement, 'label').getBoundingClientRect()
        .width,
    ).toBeLessThanOrEqual(144)
    await expect(
      within(part(longBetweenRow as HTMLElement, 'value')).getByText('Oct 21'),
    ).toBeVisible()

    const valueLabel = part(longValueRow as HTMLElement, 'label')
    const icon = (
      valueLabel.querySelector('svg') as SVGElement
    ).getBoundingClientRect()
    const labelBox = valueLabel.getBoundingClientRect()
    await expect(labelBox.width).toBeGreaterThanOrEqual(64)
    await expect(icon.left).toBeGreaterThanOrEqual(labelBox.left - 0.5)
    await expect(icon.right).toBeLessThanOrEqual(labelBox.right + 0.5)
    await expect(
      part(longValueRow as HTMLElement, 'value').getBoundingClientRect().left,
    ).toBeGreaterThanOrEqual(labelBox.right - 0.5)
  },
  render: () => <RowsBehavior />,
}

export const StartAlignmentByDefault: Story = {
  tags: contract,
  render: () => <RecordGroupRow label="Status">Open</RecordGroupRow>,
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement)

    await expect(row).toHaveAttribute('data-align', 'start')
    await expect(part(row, 'label').textContent).toBe('Status')
    await expect(part(row, 'value').textContent).toBe('Open')
  },
}

export const BetweenSetsDataAlign: Story = {
  tags: contract,
  render: () => (
    <RecordGroupRow align="between" label="Status">
      Open
    </RecordGroupRow>
  ),
  play: async ({ canvasElement }) => {
    await expect(firstRow(canvasElement)).toHaveAttribute(
      'data-align',
      'between',
    )
  },
}

export const LeadingOnlyWhenPassed: Story = {
  tags: contract,
  render: () => (
    <div className="flex flex-col">
      <RecordGroupRow label="Status">Open</RecordGroupRow>
      <RecordGroupRow label="Status" leading={<svg aria-hidden="true" />}>
        Open
      </RecordGroupRow>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [plain, withLeading] = rowsOf(canvasElement) as [
      HTMLElement,
      HTMLElement,
    ]

    await expect(part(plain, 'label').querySelector('svg')).toBeNull()
    await expect(part(plain, 'label').children).toHaveLength(1)
    await expect(part(withLeading, 'label').querySelector('svg')).not.toBeNull()
  },
}

export const HidesValueIconsOnlyWithLeading: Story = {
  tags: contract,
  render: () => (
    <div className="flex flex-col">
      <RecordGroupRow label="Status">
        <svg aria-hidden="true" data-slot="property-icon" />
      </RecordGroupRow>
      <RecordGroupRow label="Status" leading={<svg aria-hidden="true" />}>
        <svg aria-hidden="true" data-slot="property-icon" />
      </RecordGroupRow>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [plain, withLeading] = rowsOf(canvasElement) as [
      HTMLElement,
      HTMLElement,
    ]

    await expect(part(plain, 'value').className).not.toContain('property-icon')
    await expect(part(withLeading, 'value').className).toContain(
      '[&_[data-slot=property-icon]]:hidden',
    )
  },
}

export const DescriptionListOfTermAndValue: Story = {
  tags: contract,
  render: () => <RecordGroupRow label="Owner">Mariana Souza</RecordGroupRow>,
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement)
    const term = part(row, 'label')
    const description = part(row, 'value')

    await expect(row.tagName).toBe('DL')
    await expect(row.children).toHaveLength(2)
    await expect(term.tagName).toBe('DT')
    await expect(description.tagName).toBe('DD')
    await expect(term.parentElement).toBe(row)
    await expect(description.parentElement).toBe(row)
    await expect(term.nextElementSibling).toBe(description)
  },
}
