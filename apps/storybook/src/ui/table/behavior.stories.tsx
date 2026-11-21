import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { expect, within } from 'storybook/test'
import { tableControlArgs } from './table-controls.ts'
import { TableCanvas } from './table-frame.tsx'
import {
  ComposedTable,
  RowHeadersTable,
  ScrollRegionTable,
  tableColumns,
  tableProjects,
} from './table-layouts.tsx'

const meta = {
  decorators: [TableCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Table/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const backgroundOf = (element: Element) =>
  getComputedStyle(element).backgroundColor

export const NativeTableSemantics: Story = {
  render: () => <ComposedTable {...tableControlArgs} />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: tableControlArgs.caption,
    })
    await expect(table.tagName).toBe('TABLE')
    const headers = within(table).getAllByRole('columnheader')
    await expect(headers.map((header) => header.textContent)).toEqual(
      tableColumns,
    )
    await expect(within(table).getAllByRole('row')).toHaveLength(
      tableProjects.length + 1,
    )
    await expect(within(table).getAllByRole('cell')).toHaveLength(
      tableProjects.length * tableColumns.length,
    )
  },
}

const partElements = [
  ['table-caption', 'CAPTION'],
  ['table-header', 'THEAD'],
  ['table-body', 'TBODY'],
  ['table-footer', 'TFOOT'],
  ['table-row', 'TR'],
  ['table-head', 'TH'],
  ['table-cell', 'TD'],
] as const

export const PartsRenderTheirElements: Story = {
  render: () => <ComposedTable {...tableControlArgs} footer />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table')
    await expect(table.tagName).toBe('TABLE')
    await expect(table).toHaveAttribute('data-slot', 'table')
    const container = table.parentElement as HTMLElement
    await expect(container.tagName).toBe('DIV')
    await expect(container).toHaveAttribute('data-slot', 'table-container')
    await expect(container).toHaveAttribute('data-variant', 'default')
    for (const [slot, tagName] of partElements) {
      const parts = table.querySelectorAll(`[data-slot="${slot}"]`)
      await expect(parts.length).toBeGreaterThan(0)
      for (const part of parts) await expect(part.tagName).toBe(tagName)
    }
  },
}

export const RowHeaderInBody: Story = {
  render: () => <RowHeadersTable />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table')
    const rowHeaders = within(table).getAllByRole('rowheader')
    await expect(rowHeaders).toHaveLength(tableProjects.length)
    const website = within(table).getByRole('rowheader', { name: 'Website' })
    await expect(website).toHaveAttribute('data-slot', 'table-head')
    await expect(within(table).queryAllByRole('columnheader')).toHaveLength(0)
  },
}

export const PropsReachTable: Story = {
  render: () => (
    <Table aria-label="Projects" className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Team</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Website</TableCell>
          <TableCell>Design</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'Projects',
    })
    await expect(table).toHaveClass('table-fixed')
    const container = table.parentElement
    await expect(container).not.toHaveClass('table-fixed')
    await expect(container).not.toHaveAttribute('aria-label')
  },
}

export const RenderSetsContainer: Story = {
  render: () => <ScrollRegionTable {...tableControlArgs} />,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Projects',
    })
    await expect(region.tagName).toBe('SECTION')
    await expect(region).toHaveAttribute('data-slot', 'table-container')
    await expect(region).toHaveAttribute('data-variant', 'default')
    await expect(region).toHaveAttribute('tabindex', '0')
    await expect(region.firstElementChild).toBe(
      within(region).getByRole('table'),
    )
  },
}

export const ScrollsInsideContainer: Story = {
  render: () => <ScrollRegionTable {...tableControlArgs} />,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Projects',
    })
    const frame = region.parentElement as HTMLElement
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth)
    await expect(region.getBoundingClientRect().width).toBe(
      frame.getBoundingClientRect().width,
    )
    const cell = within(region).getByText('Help center')
    const range = document.createRange()
    range.selectNodeContents(cell)
    await expect(range.getClientRects()).toHaveLength(1)
  },
}

export const CaptionBelowRows: Story = {
  render: () => <ComposedTable {...tableControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const caption = canvas.getByText(tableControlArgs.caption)
    const rows = canvas.getAllByRole('row')
    const lastRow = rows.at(-1) as HTMLElement
    await expect(caption.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      lastRow.getBoundingClientRect().bottom,
    )
  },
}

export const CheckboxColumnShrinks: Story = {
  render: () => <ComposedTable {...tableControlArgs} selection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Select all rows', 'Select Website']) {
      const checkbox = canvas.getByRole('checkbox', { name })
      const cell = checkbox.closest('th, td') as HTMLElement
      const checkboxBox = checkbox.getBoundingClientRect()
      const cellBox = cell.getBoundingClientRect()
      await expect(cellBox.width).toBeLessThanOrEqual(checkboxBox.width + 11)
      await expect(
        Math.abs(cellBox.right - checkboxBox.right),
      ).toBeLessThanOrEqual(1)
    }
  },
}

export const SelectedRowTint: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ComposedTable {...tableControlArgs} caption="Default" selectedRow />
      <ComposedTable
        {...tableControlArgs}
        caption="Card"
        selectedRow
        variant="card"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const defaultRows = within(
      canvas.getByRole('table', { name: 'Default' }),
    ).getAllByRole('row')
    const selected = defaultRows[2] as HTMLElement
    const plain = defaultRows[1] as HTMLElement
    await expect(backgroundOf(selected)).not.toBe(backgroundOf(plain))
    const cardCells = within(
      canvas.getByRole('table', { name: 'Card' }),
    ).getAllByRole('cell')
    const selectedCell = cardCells[tableColumns.length] as HTMLElement
    const plainCell = cardCells[0] as HTMLElement
    await expect(backgroundOf(selectedCell)).not.toBe(backgroundOf(plainCell))
  },
}

export const CardVariantSeparatesCells: Story = {
  render: () => <ComposedTable {...tableControlArgs} variant="card" />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table')
    await expect(table.parentElement).toHaveAttribute('data-variant', 'card')
    await expect(getComputedStyle(table).borderCollapse).toBe('separate')
    const cells = within(table).getAllByRole('cell')
    const first = cells[0] as HTMLElement
    const last = cells.at(-1) as HTMLElement
    await expect(getComputedStyle(first).borderTopLeftRadius).not.toBe('0px')
    await expect(getComputedStyle(last).borderBottomRightRadius).not.toBe('0px')
  },
}
