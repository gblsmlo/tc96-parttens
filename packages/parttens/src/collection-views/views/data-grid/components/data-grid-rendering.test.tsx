import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../../../test/dom')

class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { DataGrid } = await import('./data-grid')
const { useDataGrid } = await import('../hooks/use-data-grid')
const { createSelectColumn } = await import('../lib/create-select-column')

interface Item {
  done: boolean
  id: string
  title: string
}

const items: Item[] = [
  { done: true, id: 'a', title: 'Alpha' },
  { done: false, id: 'b', title: 'Beta' },
]

const columns = [
  { accessorKey: 'title', header: 'Title', meta: { label: 'Title' } },
  {
    accessorKey: 'done',
    header: 'Done',
    meta: { label: 'Done', variant: 'checkbox' as const },
  },
]

type Table = ReturnType<typeof useDataGrid<Item>>['table']

afterEach(cleanup)

function renderGrid(data: Item[] = items, selectable = false) {
  const captured: { table: Table | null } = { table: null }

  function Example({ rows }: Readonly<{ rows: Item[] }>): ReactElement {
    const { table } = useDataGrid<Item>({
      columns,
      data: rows,
      enableRowSelection: selectable,
      getRowId: (item) => item.id,
    })
    captured.table = table
    return <DataGrid aria-label="Items" table={table} />
  }

  const view = render(<Example rows={data} />)
  return {
    ...view,
    captured,
    rerenderWith: (rows: Item[]) => view.rerender(<Example rows={rows} />),
  }
}

describe('DataGrid memoized rows', () => {
  test('re-renders a row when its data changes', () => {
    const { rerenderWith } = renderGrid()
    expect(screen.getByText('Beta')).toBeTruthy()

    rerenderWith([
      { done: true, id: 'a', title: 'Alpha' },
      { done: false, id: 'b', title: 'Gamma' },
    ])

    expect(screen.queryByText('Beta')).toBeNull()
    expect(screen.getByText('Gamma')).toBeTruthy()
  })

  test('re-renders every row when a column is hidden', () => {
    const { captured, container } = renderGrid()

    act(() => {
      captured.table?.getColumn('done')?.toggleVisibility(false)
    })

    const firstRow = container.querySelector('[data-slot="data-grid-row"]')
    expect(firstRow?.querySelectorAll('[role="gridcell"]')).toHaveLength(1)
  })

  test('marks a row as selected when the table selection changes', () => {
    const { captured, container } = renderGrid(items, true)

    act(() => {
      captured.table?.getRow('b').toggleSelected(true)
    })

    const rows = container.querySelectorAll('[data-slot="data-grid-row"]')
    expect(rows[0]?.getAttribute('data-state')).toBeNull()
    expect(rows[1]?.getAttribute('data-state')).toBe('selected')
  })

  test('moves the selected cell mark when another cell is clicked', () => {
    const { container } = renderGrid()
    const cells = container.querySelectorAll('[data-slot="data-grid-cell"]')

    fireEvent.click(cells[0] as Element)
    expect(cells[0]?.getAttribute('data-selected')).toBe('true')
    fireEvent.click(cells[2] as Element)

    expect(cells[0]?.getAttribute('data-selected')).toBeNull()
    expect(cells[2]?.getAttribute('data-selected')).toBe('true')
    expect(cells[2]?.getAttribute('tabindex')).toBe('0')
  })
})

describe('DataGrid ARIA', () => {
  test('declares multiple selection on the grid', () => {
    renderGrid()

    expect(screen.getByRole('grid').getAttribute('aria-multiselectable')).toBe(
      'true',
    )
  })

  test('omits aria-selected on rows when row selection does not apply', () => {
    const { container } = renderGrid()

    for (const row of container.querySelectorAll(
      '[data-slot="data-grid-row"]',
    )) {
      expect(row.hasAttribute('aria-selected')).toBe(false)
    }
  })

  test('spells out the checkbox variant for assistive technology', () => {
    const { container } = renderGrid()
    const rows = container.querySelectorAll('[data-slot="data-grid-row"]')

    expect(rows[0]?.textContent).toContain('Marcado')
    expect(rows[1]?.textContent).toContain('Desmarcado')
  })

  test('always supplies the resize bounds and clamps the keyboard resize', () => {
    renderGrid()
    const separator = screen.getAllByRole('separator')[0] as HTMLElement

    expect(separator.getAttribute('aria-valuemin')).toBe('80')
    expect(separator.getAttribute('aria-valuemax')).not.toBeNull()

    for (let step = 0; step < 40; step += 1) {
      fireEvent.keyDown(separator, { key: 'ArrowLeft' })
    }
    expect(
      (screen.getAllByRole('separator')[0] as HTMLElement).getAttribute(
        'aria-valuenow',
      ),
    ).toBe('80')

    fireEvent.keyDown(separator, { key: 'ArrowRight' })
    expect(
      (screen.getAllByRole('separator')[0] as HTMLElement).getAttribute(
        'aria-valuenow',
      ),
    ).toBe('88')
  })
})

describe('DataGrid cell invalidation', () => {
  type Options = Parameters<typeof useDataGrid<Item>>[0]

  function mountWith(initial: Partial<Options>) {
    const captured: { table: Table | null } = { table: null }

    function Example({ extra }: Readonly<{ extra: Partial<Options> }>) {
      const { table } = useDataGrid<Item>({
        columns,
        data: items,
        getRowId: (item) => item.id,
        ...extra,
      })
      captured.table = table
      return <DataGrid table={table} />
    }

    const view = render(<Example extra={initial} />)
    return {
      ...view,
      captured,
      update: (extra: Partial<Options>) =>
        view.rerender(<Example extra={extra} />),
    }
  }

  const metaColumn = (renders?: { count: number }): Options['columns'] => [
    {
      accessorKey: 'title',
      cell: ({ table }) => {
        if (renders) renders.count += 1
        return (table.options.meta as { tag?: string } | undefined)?.tag
      },
      header: 'Title',
    },
  ]

  test('re-renders cells when table meta changes', () => {
    const stable = metaColumn()
    const { update } = mountWith({
      columns: stable,
      tableOptions: { meta: { tag: 'one' } as never },
    })
    expect(screen.getAllByText('one')).toHaveLength(2)

    update({
      columns: stable,
      tableOptions: { meta: { tag: 'two' } as never },
    })

    expect(screen.getAllByText('two')).toHaveLength(2)
  })

  test('re-renders the select column when a function enableRowSelection changes', () => {
    const select = [createSelectColumn<Item>(), ...columns]
    const { update } = mountWith({
      columns: select,
      tableOptions: { enableRowSelection: () => true },
    })
    const disabled = () =>
      screen
        .getAllByRole('checkbox', { name: 'Selecionar registro' })
        .map((box) => box.hasAttribute('data-disabled'))
    expect(disabled()).toEqual([false, false])

    update({
      columns: select,
      tableOptions: { enableRowSelection: () => false },
    })

    expect(disabled()).toEqual([true, true])
  })

  test('re-renders the select column checkbox when the row selection changes', () => {
    const { captured } = mountWith({
      columns: [createSelectColumn<Item>(), ...columns],
      enableRowSelection: true,
    })

    act(() => {
      captured.table?.getRow('a').toggleSelected(true)
    })

    const boxes = screen.getAllByRole('checkbox', {
      name: 'Selecionar registro',
    })
    expect(boxes[0]?.getAttribute('aria-checked')).toBe('true')
    expect(boxes[1]?.getAttribute('aria-checked')).toBe('false')
  })

  test('re-renders cells when the column definitions change', () => {
    const { update } = mountWith({ columns: metaColumn() })
    const swapped: Options['columns'] = [
      { accessorKey: 'title', cell: () => 'swapped', header: 'Title' },
    ]

    update({ columns: swapped })

    expect(screen.getAllByText('swapped')).toHaveLength(2)
  })

  test('keeps cells untouched when only an inline onCellValueChange changes, and calls the latest one', () => {
    const renders = { count: 0 }
    const stable = metaColumn(renders)
    const calls: string[] = []
    const { captured, update } = mountWith({
      columns: stable,
      onCellValueChange: () => calls.push('first'),
    })
    const before = renders.count

    update({ columns: stable, onCellValueChange: () => calls.push('second') })

    expect(renders.count).toBe(before)
    captured.table?.options.meta?.onDataGridCellValueChange?.({
      columnId: 'title',
      rowId: 'a',
      value: 'x',
    })
    expect(calls).toEqual(['second'])
  })
})

describe('DataGrid cell selection lifetime', () => {
  const third: Item = { done: false, id: 'c', title: 'Gamma' }

  function mount(rows: Item[]) {
    const captured: { table: Table | null } = { table: null }

    function Example({ data }: Readonly<{ data: Item[] }>): ReactElement {
      const { table } = useDataGrid<Item>({
        columns,
        data,
        getRowId: (item) => item.id,
      })
      captured.table = table
      return <DataGrid table={table} />
    }

    const view = render(<Example data={rows} />)
    const cell = (row: number, column: number) =>
      view.container
        .querySelectorAll('[data-slot="data-grid-row"]')
        [row]?.querySelectorAll('[data-slot="data-grid-cell"]')[
        column
      ] as HTMLElement
    return {
      captured,
      cell,
      setData: (data: Item[]) => view.rerender(<Example data={data} />),
    }
  }

  test('restores the selected cell when a hidden column is shown again', () => {
    const { captured, cell } = mount(items)
    fireEvent.click(cell(0, 1))

    act(() => captured.table?.getColumn('done')?.toggleVisibility(false))
    act(() => captured.table?.getColumn('done')?.toggleVisibility(true))

    expect(cell(0, 1).getAttribute('data-selected')).toBe('true')
    expect(cell(0, 1).getAttribute('tabindex')).toBe('0')
    expect(cell(0, 1).getAttribute('data-focused')).toBe('true')
  })

  test('restores the selected cell when a filter is removed', () => {
    const { captured, cell } = mount(items)
    fireEvent.click(cell(1, 0))

    act(() => captured.table?.setGlobalFilter('Alpha'))
    expect(cell(0, 0).getAttribute('data-selected')).toBeNull()
    act(() => captured.table?.setGlobalFilter(''))

    expect(cell(1, 0).getAttribute('data-selected')).toBe('true')
    expect(cell(1, 0).getAttribute('tabindex')).toBe('0')
  })

  test('drops the selection of a row that left the dataset', () => {
    const { cell, setData } = mount(items)
    fireEvent.click(cell(1, 0))

    setData([items[0] as Item, third])
    setData(items)

    expect(cell(1, 0).getAttribute('data-selected')).toBeNull()
  })
})
