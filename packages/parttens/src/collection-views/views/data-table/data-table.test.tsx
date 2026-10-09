import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen, waitFor, within } = await import(
  '@testing-library/react'
)
const { DataTable } = await import('./data-table')
const { useDataTable } = await import('./use-data-table')

type DataTableColumnMeta<TData> =
  import('./data-table-aggregation').DataTableColumnMeta<TData>

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
  enableColumnResizing?: boolean
  enablePagination?: boolean
  withAggregation?: boolean
  withFooter?: boolean
}

function CampaignTable({
  data = campaigns,
  enableColumnResizing = false,
  enablePagination = false,
  withAggregation = false,
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
        enableResizing: false,
        header: 'Seleção',
        id: 'select',
        size: 40,
      },
      {
        accessorKey: 'title',
        header: 'Campanha',
        minSize: 120,
        size: 200,
        ...(withFooter ? { footer: 'Total' } : {}),
      },
      {
        accessorKey: 'budget',
        header: 'Verba',
        ...(withAggregation
          ? {
              meta: {
                aggregations: ['count', 'sum'],
                align: 'end',
                formatAggregation: (value: number, aggregation: string) =>
                  aggregation === 'sum' ? `R$ ${value}` : String(value),
              } satisfies DataTableColumnMeta<Campaign>,
            }
          : {}),
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
    enableColumnResizing,
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
      'data-table',
    )
    expect(
      container.firstElementChild?.firstElementChild?.getAttribute('data-slot'),
    ).toBe('table-container')
  })

  test('marks the clipped side while the columns overflow', () => {
    const { container } = render(<CampaignTable />)
    const root = container.querySelector(
      '[data-slot="data-table"]',
    ) as HTMLElement
    const scroller = container.querySelector(
      '[data-slot="table-container"]',
    ) as HTMLElement
    Object.defineProperty(scroller, 'clientWidth', { value: 300 })
    Object.defineProperty(scroller, 'scrollWidth', { value: 900 })

    fireEvent.scroll(scroller)
    expect(root.hasAttribute('data-overflow-end')).toBe(true)
    expect(root.hasAttribute('data-overflow-start')).toBe(false)

    scroller.scrollLeft = 600
    fireEvent.scroll(scroller)
    expect(root.hasAttribute('data-overflow-end')).toBe(false)
    expect(root.hasAttribute('data-overflow-start')).toBe(true)
  })

  test('draws the DataGrid frame by default', () => {
    const { container } = render(<CampaignTable />)
    const frame = container.querySelector('[data-slot="table-container"]')

    expect(frame?.hasAttribute('data-bordered')).toBe(true)
    expect(frame?.className).toContain('rounded-md border bg-background')
    expect(frame?.className).toContain('overflow-x-auto')
  })

  test('drops the frame when bordered is false', () => {
    const { container } = render(<CampaignTable bordered={false} />)
    const frame = container.querySelector('[data-slot="table-container"]')

    expect(frame?.hasAttribute('data-bordered')).toBe(false)
    expect(frame?.className).not.toContain('border')
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

  test('renders the footer when a column declares aggregations', () => {
    const { container } = render(<CampaignTable withAggregation />)
    const trigger = within(
      container.querySelector('tfoot') as HTMLElement,
    ).getByRole('button', { name: 'Calcular' })

    expect(trigger.closest('[data-slot="data-table-aggregation"]')).toBeTruthy()
  })

  test('aggregates every row, not only the current page', () => {
    const { container } = render(
      <CampaignTable
        defaultAggregations={{ budget: 'sum' }}
        enablePagination
        withAggregation
      />,
    )

    expect(container.querySelectorAll('tbody tr')).toHaveLength(2)
    expect(container.querySelector('tfoot')?.textContent).toContain(
      'Soma R$ 400',
    )
  })

  test('leaves out the aggregation footer without rows or while loading', () => {
    const { container, rerender } = render(
      <CampaignTable
        data={[]}
        defaultAggregations={{ budget: 'sum' }}
        withAggregation
      />,
    )
    expect(container.querySelector('tfoot')).toBeNull()

    rerender(
      <CampaignTable
        defaultAggregations={{ budget: 'sum' }}
        isLoading
        withAggregation
      />,
    )
    expect(container.querySelector('tfoot')).toBeNull()

    rerender(<CampaignTable data={[]} withAggregation withFooter />)
    expect(container.querySelector('tfoot')?.textContent).toBe('Total')
  })

  test('switches the aggregation from the footer menu', async () => {
    const onAggregationsChange = mock()
    const { container } = render(
      <CampaignTable
        defaultAggregations={{ budget: 'sum' }}
        onAggregationsChange={onAggregationsChange}
        withAggregation
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Soma/ }))
    fireEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Contagem' }),
    )

    expect(onAggregationsChange).toHaveBeenCalledWith({ budget: 'count' })
    await waitFor(() =>
      expect(container.querySelector('tfoot')?.textContent).toContain(
        'Contagem 3',
      ),
    )
  })

  test('follows controlled aggregations and ignores options a column lacks', () => {
    const { container, rerender } = render(
      <CampaignTable aggregations={{ budget: 'count' }} withAggregation />,
    )
    expect(container.querySelector('tfoot')?.textContent).toContain(
      'Contagem 3',
    )

    rerender(<CampaignTable aggregations={{ title: 'sum' }} withAggregation />)
    expect(
      container
        .querySelector('[data-slot="data-table-aggregation"]')
        ?.getAttribute('data-aggregation'),
    ).toBeNull()
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

  test('keeps the auto layout without column resizing', () => {
    const { container } = render(<CampaignTable />)

    expect(container.querySelector('colgroup')).toBeNull()
    expect(screen.queryByRole('separator')).toBeNull()
  })

  test('sizes every column but the last, which fills the remaining width', () => {
    const { container } = render(<CampaignTable enableColumnResizing />)
    const table = screen.getByRole('table')
    const widths = Array.from(container.querySelectorAll('col')).map(
      (col) => col.style.width,
    )

    expect(table.className).toContain('table-fixed')
    expect(table.style.minWidth).toBe('390px')
    expect(widths).toEqual(['40px', '200px', ''])
  })

  test('offers a handle only on resizable columns before the last', () => {
    render(<CampaignTable enableColumnResizing />)

    expect(
      screen.getAllByRole('separator').map((handle) => handle.ariaLabel),
    ).toEqual(['Redimensionar coluna Campanha'])
  })

  test('resizes a column with the arrow keys within its bounds', () => {
    const { container } = render(<CampaignTable enableColumnResizing />)
    const handle = screen.getByRole('separator', {
      name: 'Redimensionar coluna Campanha',
    })
    const titleColumn = () => container.querySelectorAll('col')[1]

    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(titleColumn()?.style.width).toBe('208px')
    expect(handle.getAttribute('aria-valuenow')).toBe('208')

    for (let step = 0; step < 20; step += 1) {
      fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    }
    expect(titleColumn()?.style.width).toBe('120px')

    fireEvent.doubleClick(handle)
    expect(titleColumn()?.style.width).toBe('200px')
  })
})
