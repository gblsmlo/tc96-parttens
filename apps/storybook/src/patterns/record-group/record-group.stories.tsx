import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  RecordGroup,
  RecordGroupAction,
  RecordGroupRow,
  type RecordGroupRowAlign,
  type RecordGroupVariant,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  CalendarDaysIcon,
  HashIcon,
  PlusIcon,
  ShapesIcon,
  UserIcon,
} from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

interface RowFixture {
  icon: typeof ShapesIcon
  kind: 'date' | 'text'
  label: string
  value: string
}

const detailRows: RowFixture[] = [
  { icon: ShapesIcon, kind: 'text', label: 'Type', value: 'Document request' },
  { icon: UserIcon, kind: 'text', label: 'Owner', value: 'Mariana Souza' },
  { icon: HashIcon, kind: 'text', label: 'Reference code', value: 'REQ-1042' },
  { icon: CalendarDaysIcon, kind: 'date', label: 'Due', value: '2026-10-21' },
]

const longLabelRows: RowFixture[] = [
  { icon: ShapesIcon, kind: 'text', label: 'Type', value: 'Document request' },
  {
    icon: CalendarDaysIcon,
    kind: 'date',
    label:
      'Expected delivery date agreed with the customer after the second review',
    value: '2026-10-21',
  },
]

const longValueRows: RowFixture[] = [
  { icon: ShapesIcon, kind: 'text', label: 'Type', value: 'Document request' },
  {
    icon: UserIcon,
    kind: 'text',
    label: 'Owner',
    value:
      'Mariana de Souza Albuquerque Figueiredo e Silva, Customer Success Department',
  },
]

interface RecordGroupDemoProps {
  actionLabel?: string
  align?: RecordGroupRowAlign
  defaultOpen?: boolean
  empty?: boolean
  emptyMessage?: string
  footerLabel?: string
  onAction?: () => void
  rows?: RowFixture[]
  title: string
  variant?: RecordGroupVariant
}

function RecordGroupDemo({
  actionLabel,
  align = 'start',
  defaultOpen,
  empty = false,
  emptyMessage = 'No properties yet',
  footerLabel,
  onAction,
  rows = detailRows,
  title,
  variant,
}: Readonly<RecordGroupDemoProps>) {
  return (
    <RecordGroup
      actions={
        actionLabel ? (
          <RecordGroupAction
            icon={PlusIcon}
            label={actionLabel}
            onClick={onAction}
          />
        ) : undefined
      }
      defaultOpen={defaultOpen}
      empty={empty}
      footer={
        footerLabel ? <Button variant="ghost">{footerLabel}</Button> : undefined
      }
      title={title}
      variant={variant}
    >
      {empty ? (
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      ) : (
        rows.map((row) => (
          <RecordGroupRow
            align={align}
            key={row.label}
            label={row.label}
            leading={<row.icon aria-hidden="true" />}
          >
            {row.kind === 'date' ? (
              <DateProperty readOnly value={row.value} variant="plain" />
            ) : (
              <TextProperty value={row.value} variant="plain" />
            )}
          </RecordGroupRow>
        ))
      )}
    </RecordGroup>
  )
}

const meta = {
  args: { title: 'Details' },
  component: RecordGroupDemo,
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
          'RecordGroup is a titled, collapsible group of label and value rows for record surfaces. The consumer passes the rows, every label and, when it wants to control it, the collapse state. Values are usually a `properties` component in `plain`.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/RecordGroup',
} satisfies Meta<typeof RecordGroupDemo>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-row"]',
    ),
  )

const part = (row: HTMLElement, slot: 'label' | 'value') =>
  row.querySelector(`[data-slot="record-group-row-${slot}"]`) as HTMLElement

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })

    expect(title).toHaveAttribute('aria-expanded', 'true')
    expect(canvas.getByRole('region', { name: 'Details' })).toBeVisible()
    expect(rowsOf(canvasElement)).toHaveLength(detailRows.length)

    const rows = rowsOf(canvasElement)
    const labelWidths = rows.map(
      (row) => part(row, 'label').getBoundingClientRect().width,
    )
    const naturalWidths = rows.map(
      (row) => (part(row, 'label').lastElementChild as HTMLElement).scrollWidth,
    )

    expect(new Set(naturalWidths).size).toBeGreaterThan(1)
    expect(new Set(labelWidths).size).toBe(1)
    expect(labelWidths[0]).toBeGreaterThan(0)

    for (const row of rows) {
      const label = part(row, 'label').getBoundingClientRect()
      const value = part(row, 'value').getBoundingClientRect()
      expect(value.left).toBeGreaterThanOrEqual(label.right - 0.5)
    }

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'false'))
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(0))

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() =>
      expect(rowsOf(canvasElement)).toHaveLength(detailRows.length),
    )
  },
  tags: interaction,
}

export const AlignBetween: Story = {
  args: { align: 'between', title: 'Details (between)' },
}

export const AlignBetweenInteraction: Story = {
  ...AlignBetween,
  play: async ({ canvasElement }) => {
    const rows = rowsOf(canvasElement)

    expect(rows).toHaveLength(detailRows.length)
    for (const row of rows) {
      const box = row.getBoundingClientRect()
      const paddingEnd = Number.parseFloat(getComputedStyle(row).paddingRight)
      const value = part(row, 'value').getBoundingClientRect()
      const label = part(row, 'label').getBoundingClientRect()

      expect(row).toHaveAttribute('data-align', 'between')
      expect(Math.abs(value.right - (box.right - paddingEnd))).toBeLessThan(1)
      expect(value.left).toBeGreaterThan(label.right)
    }
  },
  tags: interaction,
}

export const LongLabelStart: Story = {
  args: { rows: longLabelRows, title: 'Long label (start)' },
}

export const LongLabelStartInteraction: Story = {
  ...LongLabelStart,
  play: async ({ canvasElement }) => {
    const rows = rowsOf(canvasElement)
    const longRow = rows[1] as HTMLElement
    const text = part(longRow, 'label').lastElementChild as HTMLElement
    const value = part(longRow, 'value')

    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    expect(part(longRow, 'label').getBoundingClientRect().width).toBe(
      part(rows[0] as HTMLElement, 'label').getBoundingClientRect().width,
    )
    expect(value).toBeVisible()
    expect(value).toHaveTextContent('Oct 21')
  },
  tags: interaction,
}

export const LongLabelBetween: Story = {
  args: {
    align: 'between',
    rows: longLabelRows,
    title: 'Long label (between)',
  },
}

export const LongLabelBetweenInteraction: Story = {
  ...LongLabelBetween,
  play: async ({ canvasElement }) => {
    const rows = rowsOf(canvasElement)
    const longRow = rows[1] as HTMLElement
    const box = longRow.getBoundingClientRect()
    const label = part(longRow, 'label')
    const text = label.lastElementChild as HTMLElement
    const value = part(longRow, 'value')
    const valueText = within(value).getByText('Oct 21')
    const valueBox = valueText.getBoundingClientRect()

    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    expect(value).toBeVisible()
    expect(valueBox.width).toBeGreaterThan(0)
    expect(valueBox.left).toBeGreaterThanOrEqual(
      label.getBoundingClientRect().right - 0.5,
    )
    expect(valueBox.right).toBeLessThanOrEqual(box.right + 0.5)
    expect(valueText.scrollWidth).toBeLessThanOrEqual(valueText.clientWidth + 1)
  },
  tags: interaction,
}

export const LongValueBetween: Story = {
  args: {
    align: 'between',
    rows: longValueRows,
    title: 'Long value (between)',
  },
}

export const LongValueBetweenInteraction: Story = {
  ...LongValueBetween,
  play: async ({ canvasElement }) => {
    for (const row of rowsOf(canvasElement)) {
      const box = row.getBoundingClientRect()
      const value = part(row, 'value').getBoundingClientRect()

      expect(value.right).toBeLessThanOrEqual(box.right + 0.5)
      expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    }
    const longRow = rowsOf(canvasElement)[1] as HTMLElement
    const label = part(longRow, 'label').getBoundingClientRect()
    const icon = (
      part(longRow, 'label').querySelector('svg') as SVGElement
    ).getBoundingClientRect()
    const value = part(longRow, 'value').getBoundingClientRect()

    expect(label.width).toBeGreaterThanOrEqual(64)
    expect(icon.left).toBeGreaterThanOrEqual(label.left - 0.5)
    expect(icon.right).toBeLessThanOrEqual(label.right + 0.5)
    expect(value.left).toBeGreaterThanOrEqual(label.right - 0.5)
    expect(part(longRow, 'value')).toBeVisible()
  },
  tags: interaction,
}

export const Card: Story = {
  args: { title: 'Details', variant: 'card' },
}

export const CardInteraction: Story = {
  ...Card,
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector(
      '[data-slot="record-group"]',
    ) as HTMLElement

    expect(section).toHaveAttribute('data-variant', 'card')
    expect(getComputedStyle(section).backgroundColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    )
  },
  tags: interaction,
}

export const LongTitle: Story = {
  args: {
    actionLabel: 'Add property',
    title: 'Customer onboarding and compliance details',
  },
}

export const LongTitleInteraction: Story = {
  ...LongTitle,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = 'Customer onboarding and compliance details'
    const trigger = canvas.getByRole('button', { name: title })
    const text = trigger.querySelector('span') as HTMLElement

    expect(canvas.getByRole('region', { name: title })).toBeVisible()
    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    expect(text.clientWidth).toBeLessThanOrEqual(120)
    expect(canvas.getByRole('button', { name: 'Add property' })).toBeVisible()
  },
  tags: interaction,
}

export const WithAction: Story = {
  args: { actionLabel: 'Add property', onAction: fn(), title: 'Details' },
}

export const WithActionInteraction: Story = {
  ...WithAction,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const action = canvas.getByRole('button', { name: 'Add property' })
    const title = canvas.getByRole('button', { name: 'Details' })

    expect(action).toHaveAccessibleName('Add property')
    expect(action.getAttribute('aria-label')).toBe(args.actionLabel)
    expect(action.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(canvas.getByRole('region', { name: 'Details' })).toBeVisible()

    await userEvent.click(action)
    expect(args.onAction).toHaveBeenCalledTimes(1)
    expect(title).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'false'))
    expect(action).toBeVisible()
  },
  tags: interaction,
}

export const WithFooter: Story = {
  args: { footerLabel: 'Add property', title: 'Details' },
}

export const WithFooterInteraction: Story = {
  ...WithFooter,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })
    const footer = canvasElement.querySelector(
      '[data-slot="record-group-footer"]',
    ) as HTMLElement
    const content = canvasElement.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement

    expect(footer).toBeVisible()
    expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      content.getBoundingClientRect().bottom - 0.5,
    )
    expect(
      within(footer).getByRole('button', { name: 'Add property' }),
    ).toBeVisible()

    await userEvent.click(title)
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="record-group-footer"]'),
      ).toBeNull(),
    )
    expect(canvas.queryByRole('button', { name: 'Add property' })).toBeNull()

    title.focus()
    await userEvent.tab()
    expect(canvasElement.contains(document.activeElement)).toBe(false)
  },
  tags: interaction,
}

export const Empty: Story = {
  args: {
    empty: true,
    emptyMessage: 'No properties yet',
    footerLabel: 'Add property',
    title: 'Details',
  },
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })
    const section = canvasElement.querySelector(
      '[data-slot="record-group"]',
    ) as HTMLElement

    expect(section).toHaveAttribute('data-empty', 'true')
    expect(title).toHaveAttribute('aria-expanded', 'false')
    expect(canvas.queryByText('No properties yet')).toBeNull()

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'true'))

    const message = await canvas.findByText('No properties yet')
    const content = canvasElement.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement
    const footer = await waitFor(() => {
      const found = canvasElement.querySelector(
        '[data-slot="record-group-footer"]',
      ) as HTMLElement
      expect(found).toBeVisible()
      return found
    })

    await waitFor(() => {
      const contentBox = content.getBoundingClientRect()
      const messageBox = message.getBoundingClientRect()
      expect(
        Math.abs(
          messageBox.left +
            messageBox.width / 2 -
            (contentBox.left + contentBox.width / 2),
        ),
      ).toBeLessThan(1)
      expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        contentBox.bottom - 0.5,
      )
    })
    expect(
      within(footer).getByRole('button', { name: 'Add property' }),
    ).toBeVisible()
  },
  tags: interaction,
}
