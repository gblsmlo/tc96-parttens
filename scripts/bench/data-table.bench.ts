import { createElement, type ReactElement, useState } from 'react'
import {
  countRenders,
  createBench,
  fire,
  type MountTools,
  seededRandom,
} from './bench-harness'

const { DataTable, useDataTable } = await import(
  '../../packages/parttens/src/collection-views/views/data-table'
)

type TableColumn =
  import('../../packages/parttens/src/collection-views/views/data-table').DataTableColumnDef<Row>
type TableInstance =
  import('../../packages/parttens/src/collection-views/views/data-table').DataTableTable<Row>

type Row = Record<string, string | number> & { id: string }

interface Handle {
  container: HTMLElement
  tableRef: { current: TableInstance | null }
}

const SEED = 96
const PAGE_SIZE = 50
const KINDS = ['name', 'amount', 'status', 'created', 'note'] as const

const columnKey = (index: number) => {
  const kind = KINDS[index % KINDS.length] as (typeof KINDS)[number]
  return `${kind}${index < KINDS.length ? '' : `_${Math.floor(index / KINDS.length)}`}`
}

const renderCell = countRenders(
  (context: { getValue: () => unknown }) =>
    createElement('span', null, String(context.getValue())),
  'cells',
)

const renderSelectCell = countRenders(
  (context: {
    row: {
      getIsSelected: () => boolean
      getToggleSelectedHandler: () => (event: unknown) => void
      id: string
    }
  }) =>
    createElement('input', {
      'aria-label': `Select ${context.row.id}`,
      checked: context.row.getIsSelected(),
      onChange: context.row.getToggleSelectedHandler(),
      type: 'checkbox',
    }),
  'cells',
)

function buildColumns(cols: number): TableColumn[] {
  const select = {
    cell: renderSelectCell,
    header: 'Select',
    id: 'select',
  } as unknown as TableColumn
  const data = Array.from({ length: cols - 1 }, (_, index) => {
    const key = columnKey(index)
    return { accessorKey: key, cell: renderCell, header: key } as TableColumn
  })
  return [select, ...data]
}

function buildRows(rows: number, cols: number): Row[] {
  const random = seededRandom(SEED)
  const keys = Array.from({ length: cols - 1 }, (_, index) => columnKey(index))
  return Array.from({ length: rows }, (_, rowIndex) => {
    const row: Row = { id: `row-${rowIndex}` }
    for (const key of keys) {
      if (key.startsWith('name'))
        row[key] = `Name ${Math.floor(random() * 1e6)}`
      else if (key.startsWith('amount'))
        row[key] = Math.floor(random() * 100_000) / 100
      else if (key.startsWith('status'))
        row[key] =
          ['open', 'done', 'blocked'][Math.floor(random() * 3)] ?? 'open'
      else if (key.startsWith('created'))
        row[key] = new Date(Date.UTC(2026, 0, 1 + Math.floor(random() * 365)))
          .toISOString()
          .slice(0, 10)
      else row[key] = `Value ${Math.floor(random() * 1e6)}`
    }
    return row
  })
}

const getRowId = (row: Row) => row.id

interface TableProps {
  columns: TableColumn[]
  data: Row[]
  paged: boolean
  tableRef: Handle['tableRef']
}

function Table({ columns, data, paged, tableRef }: TableProps): ReactElement {
  const { table } = useDataTable<Row>({
    columns,
    data,
    enablePagination: paged,
    enableRowSelection: true,
    enableSorting: true,
    getRowId,
    pageSize: PAGE_SIZE,
  })
  tableRef.current = table as unknown as TableInstance
  return createElement(DataTable<Row>, {
    'aria-label': 'Bench',
    table: table as unknown as TableInstance,
  })
}

function Parent(props: TableProps): ReactElement {
  const [, setTick] = useState(0)
  return createElement(
    'div',
    null,
    createElement(
      'button',
      {
        'data-bench-tick': '',
        onClick: () => setTick((tick) => tick + 1),
        type: 'button',
      },
      'Re-render',
    ),
    createElement(Table, props),
  )
}

const checkboxAt = (container: HTMLElement, row: number) => {
  const input = container.querySelectorAll<HTMLElement>(
    'tbody input[type="checkbox"]',
  )[row]
  if (!input) throw new Error(`checkbox ${row} not found`)
  return input
}

const tableCase = (rows: number, cols: number, paged: boolean) => {
  const columns = buildColumns(cols)
  const data = buildRows(rows, cols)
  return {
    id: `${rows}x${cols}${paged ? ' paged' : ''}`,
    mount(container: HTMLElement, tools: MountTools): Handle {
      const tableRef: Handle['tableRef'] = { current: null }
      tools.render(createElement(Parent, { columns, data, paged, tableRef }))
      return { container, tableRef }
    },
  }
}

const flat = ['200x10', '1000x20']
const paged = ['200x10 paged', '1000x20 paged']

const bench = createBench<Handle>({
  cases: [
    tableCase(200, 10, false),
    tableCase(1000, 20, false),
    tableCase(200, 10, true),
    tableCase(1000, 20, true),
  ],
  name: 'data-table',
  scenarios: [
    {
      cases: flat,
      name: 'select click',
      run: (handle) => fire.click(checkboxAt(handle.container, 2)),
    },
    {
      cases: flat,
      name: 'sort toggle',
      run: (handle, { index }) => {
        const column = handle.tableRef.current?.getColumn('name')
        if (!column) throw new Error('column name not found')
        column.toggleSorting(index % 2 === 1)
      },
    },
    {
      cases: paged,
      name: 'pagination next/prev',
      run: (handle, { index }) => {
        const table = handle.tableRef.current
        if (!table) throw new Error('table not ready')
        if (index % 2 === 0) table.nextPage()
        else table.previousPage()
      },
    },
    {
      name: 'parent re-render',
      run: (handle) => {
        const button = handle.container.querySelector<HTMLElement>(
          'button[data-bench-tick]',
        )
        if (!button) throw new Error('re-render button not found')
        fire.click(button)
      },
    },
  ],
  seed: SEED,
})

await bench.run()
