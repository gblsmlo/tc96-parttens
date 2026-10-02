import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { DataTable } = await import('./data-table')
const { useDataTable } = await import('./use-data-table')

interface Campaign {
  budget: number
  id: string
  title: string
}

const campaigns: Campaign[] = [
  { budget: 100, id: 'a', title: 'Retomada de inativos' },
  { budget: 250, id: 'b', title: 'Aniversariantes' },
  { budget: 50, id: 'c', title: 'Indicação premiada' },
]

type TableProps = Omit<Parameters<typeof DataTable<Campaign>>[0], 'table'> & {
  data?: Campaign[]
  enablePagination?: boolean
  withFooter?: boolean
}

function CampaignTable({
  data = campaigns,
  enablePagination = false,
  withFooter = false,
  ...props
}: Readonly<TableProps>): ReactElement {
  const { table } = useDataTable<Campaign>({
    columns: [
      {
        cell: ({ row }) => (
          <input
            aria-label={`Selecionar ${row.original.title}`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            type="checkbox"
          />
        ),
        header: 'Seleção',
        id: 'select',
      },
      {
        accessorKey: 'title',
        header: 'Campanha',
        ...(withFooter ? { footer: 'Total' } : {}),
      },
      {
        accessorKey: 'budget',
        header: 'Verba',
        ...(withFooter
          ? {
              footer: ({ table }) =>
                table
                  .getCoreRowModel()
                  .rows.reduce((sum, row) => sum + row.original.budget, 0),
            }
          : {}),
      },
    ],
    data,
    enablePagination,
    enableRowSelection: true,
    getRowId: (campaign) => campaign.id,
    pageSize: 2,
  })

  return <DataTable aria-label="Campanhas" table={table} {...props} />
}

afterEach(cleanup)

describe('DataTable', () => {
  test('renders a semantic table with headers and rows', () => {
    render(<CampaignTable />)

    const table = screen.getByRole('table', { name: 'Campanhas' })
    expect(table.tagName).toBe('TABLE')
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)
    expect(screen.getByText('Aniversariantes')).toBeTruthy()
  })

  test('is not wrapped in a CardFrame', () => {
    const { container } = render(<CampaignTable />)

    expect(container.querySelector('[data-slot="card-frame"]')).toBeNull()
    expect(container.firstElementChild?.getAttribute('data-slot')).toBe(
      'table-container',
    )
  })

  test('draws the DataGrid frame when bordered', () => {
    const { container } = render(<CampaignTable bordered />)
    const frame = container.querySelector('[data-slot="table-container"]')

    expect(frame?.hasAttribute('data-bordered')).toBe(true)
    expect(frame?.className).toContain('rounded-md border bg-background')
    expect(frame?.className).toContain('overflow-x-auto')
  })

  test('marks selected rows', () => {
    const { container } = render(<CampaignTable />)

    fireEvent.click(screen.getByLabelText('Selecionar Aniversariantes'))

    const selected = container.querySelectorAll('tr[data-state="selected"]')
    expect(selected).toHaveLength(1)
    expect(selected[0]?.textContent).toContain('Aniversariantes')
  })

  test('renders the footer only when a column declares one', () => {
    const { container, rerender } = render(<CampaignTable />)
    expect(container.querySelector('tfoot')).toBeNull()

    rerender(<CampaignTable withFooter />)
    expect(container.querySelector('tfoot')?.textContent).toContain('400')
  })

  test('shows the empty message without rows', () => {
    render(<CampaignTable data={[]} emptyMessage="Nada aqui." />)

    const cell = screen.getByText('Nada aqui.')
    expect(cell.getAttribute('colspan')).toBe('3')
  })

  test('replaces rows with skeletons while loading', () => {
    const { container } = render(
      <CampaignTable isLoading loadingRowCount={4} />,
    )

    expect(screen.getByRole('table').getAttribute('aria-busy')).toBe('true')
    expect(container.querySelectorAll('tbody tr')).toHaveLength(4)
    expect(screen.queryByText('Aniversariantes')).toBeNull()
  })

  test('paginates on the client', () => {
    const { container } = render(<CampaignTable enablePagination />)

    expect(container.querySelectorAll('tbody tr')).toHaveLength(2)
  })
})
