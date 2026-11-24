import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  createSelectColumn,
  DataGrid,
  type DataGridColumnDef,
  type DataGridGroupCellContext,
  useDataGrid,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { DataGridCanvas } from './data-grid-canvas.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface Account {
  arr: number
  id: string
  name: string
  region: string
  renewal: string
}

const accounts: Account[] = [
  {
    arr: 120,
    id: 'a1',
    name: 'Atlas',
    region: 'Américas',
    renewal: '2027-01-10',
  },
  {
    arr: 80,
    id: 'a2',
    name: 'Borealis',
    region: 'Américas',
    renewal: '2026-12-02',
  },
  {
    arr: 45,
    id: 'a3',
    name: 'Cirrus',
    region: 'Américas',
    renewal: '2027-03-21',
  },
  {
    arr: 200,
    id: 'a4',
    name: 'Delta',
    region: 'Europa',
    renewal: '2027-02-14',
  },
  {
    arr: 60,
    id: 'a5',
    name: 'Eclipse',
    region: 'Europa',
    renewal: '2026-11-30',
  },
]

const regions = [...new Set(accounts.map((account) => account.region))]

const columns: DataGridColumnDef<Account>[] = [
  createSelectColumn<Account>(),
  {
    accessorKey: 'name',
    header: 'Conta',
    meta: { label: 'Conta' },
    size: 200,
  },
  {
    accessorKey: 'arr',
    header: 'ARR',
    meta: { align: 'end', label: 'ARR', variant: 'number' },
    size: 120,
  },
  {
    accessorKey: 'renewal',
    header: 'Renovação',
    meta: { label: 'Renovação' },
    size: 160,
  },
]

const sumArr = (rows: DataGridGroupCellContext<Account>['rows']) =>
  rows.reduce((total, row) => total + row.original.arr, 0)

const renderGroupCell = ({
  column,
  rows,
}: DataGridGroupCellContext<Account>) => {
  if (column.id === 'arr') {
    return <span data-testid="subtotal">{sumArr(rows)}</span>
  }
  if (column.id === 'renewal') {
    const [next] = rows.map((row) => row.original.renewal).sort()
    return <span data-testid="next-renewal">{next}</span>
  }
  return null
}

function AccountsGrid({
  collapsedGroupIds,
  onCollapsedGroupIdsChange,
  pageSize,
  withGroupCells = true,
}: Readonly<{
  collapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  pageSize?: number
  withGroupCells?: boolean
}>) {
  const { table } = useDataGrid<Account>({
    columns,
    data: accounts,
    enablePagination: pageSize !== undefined,
    enableRowSelection: true,
    getRowId: (account) => account.id,
    pageSize,
  })

  return (
    <DataGrid<Account>
      aria-label="Contas por região"
      getRowGroup={(account) => account.region}
      table={table}
      {...(collapsedGroupIds ? { collapsedGroupIds } : {})}
      {...(onCollapsedGroupIdsChange ? { onCollapsedGroupIdsChange } : {})}
      {...(withGroupCells ? { renderGroupCell } : {})}
    />
  )
}

function CollapseAllAccounts() {
  const [collapsed, setCollapsed] = useState<readonly string[]>([])
  const allCollapsed = collapsed.length === regions.length

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="self-start"
        onClick={() => setCollapsed(allCollapsed ? [] : regions)}
        size="sm"
        variant="outline"
      >
        {allCollapsed ? 'Expandir todos' : 'Recolher todos'}
      </Button>
      <AccountsGrid
        collapsedGroupIds={collapsed}
        onCollapsedGroupIdsChange={setCollapsed}
      />
    </div>
  )
}

const gridOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('grid', { name: 'Contas por região' })

const groupRowOf = (grid: HTMLElement, region: string) => {
  const row = [
    ...grid.querySelectorAll<HTMLElement>('[data-slot="data-grid-group-row"]'),
  ].find((candidate) =>
    candidate
      .querySelector('[data-slot="data-grid-group-label"]')
      ?.textContent?.includes(region),
  )
  if (!row) throw new Error(`No group row for ${region}.`)
  return row
}

const cellOf = (row: HTMLElement, columnId: string) => {
  const cell = row.querySelector<HTMLElement>(`[data-column-id="${columnId}"]`)
  if (!cell) throw new Error(`No ${columnId} cell.`)
  return cell
}

export const GroupRowRendersACellPerColumn: Story = {
  render: () => <AccountsGrid />,
  play: async ({ canvasElement }) => {
    const row = groupRowOf(gridOf(canvasElement), 'Américas')
    const cells = within(row).getAllByRole('gridcell')
    await expect(cells.map((cell) => cell.dataset.columnId)).toEqual([
      'select',
      'name',
      'arr',
      'renewal',
    ])
    await expect(
      cells.map((cell) => cell.getAttribute('aria-colindex')),
    ).toEqual(['1', '2', '3', '4'])
  },
}

export const GroupLabelAndCountSitInTheFirstDataColumn: Story = {
  render: () => <AccountsGrid />,
  play: async ({ canvasElement }) => {
    const row = groupRowOf(gridOf(canvasElement), 'Américas')
    const first = cellOf(row, 'name')
    await expect(
      first.querySelector('[data-slot="data-grid-group-label"]'),
    ).toHaveTextContent('Américas')
    await expect(
      first.querySelector('[data-slot="data-grid-group-count"]'),
    ).toHaveTextContent('3')
    await expect(cellOf(row, 'select')).toBeEmptyDOMElement()
  },
}

export const SubtotalsAlignUnderTheirColumns: Story = {
  render: () => <AccountsGrid />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    const row = groupRowOf(grid, 'Américas')
    const bodyRow = grid.querySelector<HTMLElement>(
      '[data-slot="data-grid-row"]',
    )
    if (!bodyRow) throw new Error('The grid has no body row.')

    for (const columnId of ['select', 'name', 'arr', 'renewal']) {
      const group = cellOf(row, columnId).getBoundingClientRect()
      const body = cellOf(bodyRow, columnId).getBoundingClientRect()
      await expect(group.left).toBe(body.left)
      await expect(group.width).toBe(body.width)
    }
    await expect(within(row).getByTestId('subtotal')).toHaveTextContent('245')
    await expect(within(row).getByTestId('next-renewal')).toHaveTextContent(
      '2026-12-02',
    )
    await expect(
      within(groupRowOf(grid, 'Europa')).getByTestId('subtotal'),
    ).toHaveTextContent('260')
  },
}

export const GroupCellsReceiveTheRowsOfThePage: Story = {
  render: () => <AccountsGrid pageSize={2} />,
  play: async ({ canvasElement }) => {
    const row = groupRowOf(gridOf(canvasElement), 'Américas')
    await expect(
      cellOf(row, 'name').querySelector('[data-slot="data-grid-group-count"]'),
    ).toHaveTextContent('2')
    await expect(within(row).getByTestId('subtotal')).toHaveTextContent('200')
  },
}

export const WithoutRenderGroupCellTheGroupRowKeepsOneCell: Story = {
  render: () => <AccountsGrid withGroupCells={false} />,
  play: async ({ canvasElement }) => {
    const row = groupRowOf(gridOf(canvasElement), 'Américas')
    await expect(within(row).getAllByRole('gridcell')).toHaveLength(1)
    await expect(
      row.querySelector('[data-slot="data-grid-group-cell"]'),
    ).toBeNull()
  },
}

export const CollapseAllAndExpandAllThroughTheControlledList: Story = {
  render: () => <CollapseAllAccounts />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = gridOf(canvasElement)
    const bodyRows = () =>
      grid.querySelectorAll('[data-slot="data-grid-row"]').length
    await expect(bodyRows()).toBe(5)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Recolher todos' }),
    )
    await waitFor(() => expect(bodyRows()).toBe(0))
    await expect(
      grid.querySelectorAll(
        '[data-slot="data-grid-group-row"][data-collapsed]',
      ),
    ).toHaveLength(2)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Expandir todos' }),
    )
    await waitFor(() => expect(bodyRows()).toBe(5))
  },
}

export const GroupChevronReportsToTheControlledList: Story = {
  render: () => <CollapseAllAccounts />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Recolher Europa' }),
    )
    await expect(
      await canvas.findByRole('button', { name: 'Expandir Europa' }),
    ).toHaveAttribute('aria-expanded', 'false')
    await expect(
      canvas.getByRole('button', { name: 'Recolher todos' }),
    ).toBeVisible()
  },
}
