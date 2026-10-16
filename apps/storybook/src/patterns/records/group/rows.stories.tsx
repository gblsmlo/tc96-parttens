import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  detailRows,
  longLabelRows,
  longValueRows,
  RecordGroupDemo,
} from './fixtures/group-demo'
import { part, rowsOf } from './fixtures/group-dom'

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
          'RecordGroup is a titled, collapsible group of label and value rows for record surfaces. The consumer passes the rows, every label and, when it wants to control it, the collapse state. Values are usually a `properties` component in `plain`. `start` rows share one label column; `between` rows split the width and truncate the label first.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Rows',
} satisfies Meta<typeof RecordGroupDemo>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const expectTermAndDescription = (
  canvasElement: HTMLElement,
  pairs: ReadonlyArray<readonly [string, string]>,
) => {
  const body = canvasElement.querySelector(
    '[data-slot="record-group-content"]',
  ) as HTMLElement
  const rows = rowsOf(canvasElement)

  expect(body.tagName).toBe('DIV')
  expect(rows).toHaveLength(pairs.length)
  rows.forEach((row, index) => {
    const [label, value] = pairs[index] as readonly [string, string]

    expect(row.parentElement).toBe(body)
    expect(row.tagName).toBe('DL')
    expect(part(row, 'label').tagName).toBe('DT')
    expect(part(row, 'value').tagName).toBe('DD')
    expect(part(row, 'label')).toHaveTextContent(label)
    expect(part(row, 'value')).toHaveTextContent(value)
  })
}

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })

    expect(title).toHaveAttribute('aria-expanded', 'true')
    expect(canvas.getByRole('region', { name: 'Details' })).toBeVisible()
    expectTermAndDescription(canvasElement, [
      ['Type', 'Document request'],
      ['Owner', 'Mariana Souza'],
      ['Reference code', 'REQ-1042'],
      ['Due', 'Oct 21'],
    ])

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
      const text = part(row, 'label').lastElementChild as HTMLElement
      const value = part(row, 'value').getBoundingClientRect()
      expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
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
    const widths = rows.map(
      (row) => part(row, 'label').getBoundingClientRect().width,
    )

    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    expect(new Set(widths).size).toBe(1)
    expect(widths[0]).toBeCloseTo(112, 0)
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
    expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(144)
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
