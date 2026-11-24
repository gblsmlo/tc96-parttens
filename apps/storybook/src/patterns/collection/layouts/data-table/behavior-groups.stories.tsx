import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  DataTable,
  type DataTableColumnDef,
  type DataTableGroupCellContext,
  useDataTable,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { DataTableCanvas } from './data-table-canvas.tsx'

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface Account {
  arr: number
  id: string
  name: string
  region: string
}

const accounts: Account[] = [
  { arr: 120, id: 'a1', name: 'Acme', region: 'América' },
  { arr: 80, id: 'a2', name: 'Globex', region: 'América' },
  { arr: 60, id: 'a3', name: 'Initech', region: 'Europa' },
  { arr: 40, id: 'a4', name: 'Umbrella', region: 'Europa' },
  { arr: 30, id: 'a5', name: 'Hooli', region: 'Ásia' },
]

const columns: DataTableColumnDef<Account>[] = [
  { accessorKey: 'name', header: 'Conta', meta: { label: 'Conta' } },
  {
    accessorKey: 'arr',
    header: 'ARR',
    meta: { align: 'end', label: 'ARR' },
  },
]

const regionOf = (account: Account) => account.region

const renderSubtotal = ({
  column,
  rows,
}: DataTableGroupCellContext<Account>) =>
  column.id === 'arr' ? (
    <span data-testid="subtotal">
      {rows.reduce((total, row) => total + row.original.arr, 0)}
    </span>
  ) : null

const groupToggleLabel = (group: string, collapsed: boolean) =>
  collapsed ? `Mostrar ${group}` : `Ocultar ${group}`

const onCollapsedChange = fn()

function AccountsTable({
  subtotals = false,
}: Readonly<{ subtotals?: boolean }>) {
  const { table } = useDataTable<Account>({
    columns,
    data: accounts,
    getRowId: (account) => account.id,
  })

  return (
    <DataTable
      aria-label="Contas por região"
      getGroupToggleLabel={groupToggleLabel}
      getRowGroup={regionOf}
      table={table}
      {...(subtotals ? { renderGroupCell: renderSubtotal } : {})}
    />
  )
}

const regions = ['América', 'Europa', 'Ásia']

function CollapseAllAccounts() {
  const [collapsed, setCollapsed] = useState<readonly string[]>([])
  const { table } = useDataTable<Account>({
    columns,
    data: accounts,
    getRowId: (account) => account.id,
  })
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
      <DataTable
        aria-label="Contas por região"
        collapsedGroupIds={collapsed}
        getRowGroup={regionOf}
        onCollapsedGroupIdsChange={(next) => {
          onCollapsedChange(next)
          setCollapsed(next)
        }}
        table={table}
      />
    </div>
  )
}

const tableOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('table', { name: 'Contas por região' })

const groupRowsOf = (table: HTMLElement) => [
  ...table.querySelectorAll<HTMLElement>('[data-slot="data-table-group-row"]'),
]

const accountNames = (table: HTMLElement) =>
  [...table.querySelectorAll('tbody tr[data-slot="table-row"]')].map(
    (row) => row.querySelector('td')?.textContent,
  )

export const EachRunOpensAGroupBody: Story = {
  render: () => <AccountsTable />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    const bodies = table.querySelectorAll('tbody')
    await expect(bodies).toHaveLength(3)
    const headers = within(table).getAllByRole('rowheader')
    await expect(headers.map((header) => header.textContent)).toEqual([
      'América2',
      'Europa2',
      'Ásia1',
    ])
    for (const header of headers) {
      await expect(header).toHaveAttribute('scope', 'rowgroup')
      await expect(header).toHaveAttribute('colspan', '2')
    }
    await expect(
      within(bodies[1] as HTMLElement).getByText('Initech'),
    ).toBeVisible()
  },
}

export const ChevronCollapsesItsGroup: Story = {
  render: () => <AccountsTable />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    const toggle = within(table).getByRole('button', { name: 'Ocultar Europa' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(toggle)

    await waitFor(() =>
      expect(accountNames(table)).toEqual(['Acme', 'Globex', 'Hooli']),
    )
    const collapsed = within(table).getByRole('button', {
      name: 'Mostrar Europa',
    })
    await expect(collapsed).toHaveAttribute('aria-expanded', 'false')
    await expect(groupRowsOf(table)[1]).toHaveAttribute(
      'data-collapsed',
      'true',
    )
  },
}

export const GroupCellsShowPerColumnSubtotals: Story = {
  render: () => <AccountsTable subtotals />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    const [america] = groupRowsOf(table)
    if (!america) throw new Error('The first group row is missing.')
    await expect(america.children).toHaveLength(2)
    await expect(america.children[0]?.tagName).toBe('TH')
    await expect(america.children[0]).not.toHaveAttribute('colspan')
    await expect(
      within(table)
        .getAllByTestId('subtotal')
        .map((cell) => cell.textContent),
    ).toEqual(['200', '100', '30'])
    await expect(
      america.querySelector('[data-slot="data-table-group-cell"]'),
    ).toHaveClass('text-end')
  },
}

export const CollapseAllUsesTheControlledList: Story = {
  render: () => <CollapseAllAccounts />,
  play: async ({ canvasElement }) => {
    onCollapsedChange.mockClear()
    const canvas = within(canvasElement)
    const table = tableOf(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Recolher todos' }),
    )
    await waitFor(() => expect(accountNames(table)).toEqual([]))
    await expect(groupRowsOf(table)).toHaveLength(3)

    await userEvent.click(
      within(table).getByRole('button', { name: 'Expandir Ásia' }),
    )
    await expect(onCollapsedChange).toHaveBeenLastCalledWith([
      'América',
      'Europa',
    ])
    await waitFor(() => expect(accountNames(table)).toEqual(['Hooli']))
  },
}
