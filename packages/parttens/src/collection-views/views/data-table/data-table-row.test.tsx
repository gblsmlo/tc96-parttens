import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { DataTable } = await import('./data-table')
const { useDataTable } = await import('./use-data-table')

import type { DataTableColumnDef, DataTableTable } from './use-data-table'

interface Campaign {
  budget: number
  id: string
  title: string
}

interface CampaignMeta {
  currency: string
}

const campaigns: Campaign[] = [
  { budget: 100, id: 'a', title: 'Retomada de inativos' },
  { budget: 250, id: 'b', title: 'Aniversariantes' },
  { budget: 50, id: 'c', title: 'Indicação premiada' },
]

const renders = { count: 0 }

function selectColumn(): DataTableColumnDef<Campaign> {
  return {
    cell: ({ row }) => (
      <input
        aria-label={`Selecionar ${row.original.title}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        type="checkbox"
      />
    ),
    header: 'Seleção',
    id: 'select',
  }
}

function budgetColumn(prefix = ''): DataTableColumnDef<Campaign> {
  return {
    accessorKey: 'budget',
    cell: ({ row }) => {
      renders.count += 1
      return `${prefix}${row.original.budget}`
    },
    header: 'Verba',
  }
}

const titleColumn: DataTableColumnDef<Campaign> = {
  accessorKey: 'title',
  header: 'Campanha',
}

interface HarnessProps {
  columns?: DataTableColumnDef<Campaign>[]
  data?: Campaign[]
  enableRowSelection?: boolean
  meta?: CampaignMeta
  onTable?: (table: DataTableTable<Campaign>) => void
}

const defaultColumns = [selectColumn(), titleColumn, budgetColumn()]

function Harness({
  columns = defaultColumns,
  data = campaigns,
  enableRowSelection = true,
  meta,
  onTable,
}: Readonly<HarnessProps>): ReactElement {
  const { table } = useDataTable<Campaign>({
    columns,
    data,
    enableRowSelection,
    getRowId: (campaign) => campaign.id,
    tableOptions: { meta },
  })
  onTable?.(table)

  return <DataTable aria-label="Campanhas" table={table} />
}

afterEach(() => {
  cleanup()
  renders.count = 0
})

describe('DataTable rows', () => {
  test('selecting reflects in the checkbox and the row state', () => {
    const { container } = render(<Harness />)
    const checkbox = screen.getByLabelText(
      'Selecionar Aniversariantes',
    ) as HTMLInputElement
    expect(checkbox.checked).toBe(false)

    fireEvent.click(checkbox)

    expect(
      (screen.getByLabelText('Selecionar Aniversariantes') as HTMLInputElement)
        .checked,
    ).toBe(true)
    expect(
      container.querySelectorAll('tr[data-state="selected"]'),
    ).toHaveLength(1)
  })

  test('selecting one row renders only that row', () => {
    render(<Harness />)
    renders.count = 0

    fireEvent.click(screen.getByLabelText('Selecionar Aniversariantes'))

    expect(renders.count).toBe(1)
  })

  test('hiding and showing a column re-renders the rows', () => {
    let table: DataTableTable<Campaign> | undefined
    const { container } = render(
      <Harness
        onTable={(instance) => {
          table = instance
        }}
      />,
    )
    expect(container.querySelectorAll('tbody tr:first-child td')).toHaveLength(
      3,
    )

    act(() => table?.getColumn('budget')?.toggleVisibility(false))
    expect(container.querySelectorAll('tbody tr:first-child td')).toHaveLength(
      2,
    )
    expect(screen.queryByText('250')).toBeNull()

    act(() => table?.getColumn('budget')?.toggleVisibility(true))
    expect(container.querySelectorAll('tbody tr:first-child td')).toHaveLength(
      3,
    )
    expect(screen.getByText('250')).toBeTruthy()
  })

  test('a new cell renderer re-renders the rows', () => {
    const { rerender } = render(
      <Harness columns={[selectColumn(), titleColumn, budgetColumn()]} />,
    )
    expect(screen.getByText('250')).toBeTruthy()

    rerender(
      <Harness columns={[selectColumn(), titleColumn, budgetColumn('R$ ')]} />,
    )

    expect(screen.getByText('R$ 250')).toBeTruthy()
  })

  test('a meta change re-renders the rows', () => {
    const metaColumn: DataTableColumnDef<Campaign> = {
      accessorKey: 'budget',
      cell: ({ row, table }) =>
        `${(table.options.meta as CampaignMeta | undefined)?.currency}${row.original.budget}`,
      header: 'Verba',
    }
    const columns = [selectColumn(), titleColumn, metaColumn]
    const { rerender } = render(
      <Harness columns={columns} meta={{ currency: 'R$ ' }} />,
    )
    expect(screen.getByText('R$ 250')).toBeTruthy()

    rerender(<Harness columns={columns} meta={{ currency: 'US$ ' }} />)

    expect(screen.getByText('US$ 250')).toBeTruthy()
  })

  test('changing enableRowSelection re-renders the rows', () => {
    const { rerender } = render(<Harness enableRowSelection />)
    expect(
      (screen.getByLabelText('Selecionar Aniversariantes') as HTMLInputElement)
        .disabled,
    ).toBe(false)

    rerender(<Harness enableRowSelection={false} />)

    expect(
      (screen.getByLabelText('Selecionar Aniversariantes') as HTMLInputElement)
        .disabled,
    ).toBe(true)
  })

  test('new row data re-renders the changed row', () => {
    const { rerender } = render(<Harness />)
    expect(screen.getByText('250')).toBeTruthy()

    rerender(
      <Harness
        data={campaigns.map((campaign) =>
          campaign.id === 'b' ? { ...campaign, budget: 999 } : campaign,
        )}
      />,
    )

    expect(screen.getByText('999')).toBeTruthy()
    expect(screen.queryByText('250')).toBeNull()
  })

  test('sorting and an unrelated parent render skip every row', () => {
    let table: DataTableTable<Campaign> | undefined
    const { rerender } = render(
      <Harness
        onTable={(instance) => {
          table = instance
        }}
      />,
    )
    renders.count = 0

    rerender(
      <Harness
        onTable={(instance) => {
          table = instance
        }}
      />,
    )
    expect(renders.count).toBe(0)

    act(() => table?.setSorting([{ desc: true, id: 'budget' }]))
    expect(renders.count).toBe(0)
  })
})
