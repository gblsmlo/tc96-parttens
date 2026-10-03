import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../../../test/dom')

class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { DataGridSearch } = await import('./data-grid-search')
const { CollectionToolbar } = await import(
  '../../../../shared/components/collection-toolbar'
)
const { useDataGrid } = await import('../hooks/use-data-grid')

interface Record {
  id: string
  owner: string
  title: string
}

const records: Record[] = [
  { id: 'a', owner: 'Ana', title: 'Retomada de inativos' },
  { id: 'b', owner: 'Bruno', title: 'Aniversariantes' },
]

const columns = [
  { accessorKey: 'title', header: 'Item', meta: { label: 'Item' } },
  {
    accessorKey: 'owner',
    header: 'Responsável',
    meta: { label: 'Responsável' },
  },
]

afterEach(cleanup)

describe('DataGridSearch', () => {
  test('drives the global filter and returns to the first page on every keystroke', () => {
    const seen = { pageIndex: -1, rows: [] as string[] }

    function SearchExample(): ReactElement {
      const { table } = useDataGrid<Record>({
        columns,
        data: records,
        enablePagination: true,
        getRowId: (record) => record.id,
        pageSize: 1,
      })
      seen.pageIndex = table.atoms.pagination.get().pageIndex
      seen.rows = table.getRowModel().rows.map((row) => row.id)

      return (
        <CollectionToolbar>
          <DataGridSearch placeholder="Buscar…" table={table} />
        </CollectionToolbar>
      )
    }

    render(<SearchExample />)

    const field = screen.getByRole('searchbox', { name: 'Buscar…' })
    fireEvent.change(field, { target: { value: 'Aniversariantes' } })

    expect(seen.rows).toEqual(['b'])
    expect(seen.pageIndex).toBe(0)
  })
})
