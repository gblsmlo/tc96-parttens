import {
  CalendarDotsIcon,
  HashIcon,
  ShapesIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  RecordGroup,
  RecordGroupRow,
  SelectProperty,
  TextProperty,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../../properties/properties-labels.ts'
import { part, rowsOf } from '../fixtures/group-dom'
import { statusOptions } from '../layouts/rows'
import { RecordGroupCanvas } from '../record-group-canvas'

const longLabel =
  'Expected delivery date agreed with the customer after the second review'
const longValue =
  'Mariana de Souza Albuquerque Figueiredo e Silva, Customer Success Department'

const labelText = (row: HTMLElement) =>
  part(row, 'label').lastElementChild as HTMLElement

const centerOf = (element: HTMLElement) => {
  const box = element.getBoundingClientRect()
  return box.top + box.height / 2
}

function RequestGroup() {
  const [title, setTitle] = useState<string | null>('Quarterly access review')
  const [status, setStatus] = useState<string | null>('progress')

  return (
    <RecordGroup title="Request">
      <RecordGroupRow label="Title" leading={<HashIcon aria-hidden />}>
        <TextProperty
          ariaLabel="Title"
          editing="inline"
          onCommit={setTitle}
          value={title}
          labels={ptBRPropertyLabels.text}
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
      <RecordGroupRow label="Due" leading={<CalendarDotsIcon aria-hidden />}>
        <DateProperty
          readOnly
          value="2026-10-21"
          variant="plain"
          labels={ptBRPropertyLabels.date}
        />
      </RecordGroupRow>
      <RecordGroupRow
        label={longLabel}
        leading={<CalendarDotsIcon aria-hidden />}
      >
        <DateProperty
          readOnly
          value="2026-10-21"
          variant="plain"
          labels={ptBRPropertyLabels.date}
        />
      </RecordGroupRow>
    </RecordGroup>
  )
}

function CustomerGroup() {
  return (
    <RecordGroup title="Customer">
      <RecordGroupRow
        align="between"
        label="Type"
        leading={<ShapesIcon aria-hidden />}
      >
        <TextProperty
          value="Document request"
          variant="plain"
          labels={ptBRPropertyLabels.text}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align="between"
        label={longLabel}
        leading={<CalendarDotsIcon aria-hidden />}
      >
        <DateProperty
          readOnly
          value="2026-10-21"
          variant="plain"
          labels={ptBRPropertyLabels.date}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align="between"
        label="Owner"
        leading={<UserIcon aria-hidden />}
      >
        <TextProperty
          value={longValue}
          variant="plain"
          labels={ptBRPropertyLabels.text}
        />
      </RecordGroupRow>
    </RecordGroup>
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
  decorators: [RecordGroupCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const firstRow = (canvasElement: HTMLElement) =>
  rowsOf(canvasElement)[0] as HTMLElement

export const RowStartLabelsShareOneColumn: Story = {
  play: async ({ canvasElement }) => {
    const request = within(canvasElement).getByRole('region', {
      name: 'Request',
    })
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
    await expectStartRows(request)
  },
  render: () => <RequestGroup />,
}

export const RowLeadingHidesValueIcons: Story = {
  play: async ({ canvasElement }) => {
    const statusRow = rowsOf(canvasElement)[1] as HTMLElement
    const icons = part(statusRow, 'value').querySelectorAll(
      '[data-slot="property-icon"]',
    )

    await expect(icons.length).toBeGreaterThan(0)
    for (const icon of icons) {
      await expect(getComputedStyle(icon).display).toBe('none')
    }
  },
  render: () => <RequestGroup />,
}

export const RowEditingKeepsRowsAligned: Story = {
  play: async ({ canvasElement }) => {
    const request = within(canvasElement).getByRole('region', {
      name: 'Request',
    })
    const statusRow = rowsOf(request)[1] as HTMLElement

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
      expect(within(part(statusRow, 'value')).getByText('Done')).toBeVisible(),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expectStartRows(request)
  },
  render: () => <RequestGroup />,
}

export const RowBetweenKeepsTheValueAtTheEnd: Story = {
  play: async ({ canvasElement }) => {
    const customer = within(canvasElement).getByRole('region', {
      name: 'Customer',
    })
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
  render: () => <CustomerGroup />,
}

export const RowStartAlignmentByDefault: Story = {
  render: () => <RecordGroupRow label="Status">Open</RecordGroupRow>,
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement)

    await expect(row).toHaveAttribute('data-align', 'start')
    await expect(part(row, 'label').textContent).toBe('Status')
    await expect(part(row, 'value').textContent).toBe('Open')
  },
}

export const RowBetweenSetsDataAlign: Story = {
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

export const RowLeadingOnlyWhenPassed: Story = {
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

export const RowHidesValueIconsOnlyWithLeading: Story = {
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

export const RowDescriptionListOfTermAndValue: Story = {
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
