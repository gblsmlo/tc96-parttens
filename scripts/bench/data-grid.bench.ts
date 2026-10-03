import { act, createElement, type ReactElement, useState } from 'react'
import {
  countRenders,
  createBench,
  fire,
  type MountTools,
  seededRandom,
} from './bench-harness'

const { DataGrid, DataGridCell, useDataGrid } = await import(
  '../../packages/parttens/src/collection-views/views/data-grid'
)

type GridColumn =
  import('../../packages/parttens/src/collection-views/views/data-grid').DataGridColumnDef<Row>
type GridTable =
  import('../../packages/parttens/src/collection-views/views/data-grid').DataGridTable<Row>

type Row = Record<string, string | number> & { id: string; region: string }

interface Handle {
  container: HTMLElement
  tableRef: { current: GridTable | null }
}

const SEED = 96
const GROUPS = 10
const STAGES = [
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'progress' },
  { label: 'Done', value: 'done' },
]
const BADGES = ['default', 'success', 'warning', 'info']
const KINDS = [
  'id',
  'name',
  'amount',
  'stage',
  'status',
  'created',
  'owner',
  'qty',
  'region',
  'note',
] as const

const columnKey = (index: number) => {
  const kind = KINDS[index % KINDS.length] as (typeof KINDS)[number]
  return `${kind}${index < KINDS.length ? '' : `_${Math.floor(index / KINDS.length)}`}`
}

const renderCell = countRenders(
  (
    context: Parameters<
      NonNullable<GridColumn['cell']> & ((c: never) => unknown)
    >[0],
  ) => createElement(DataGridCell<Row>, { context: context as never }),
  'cells',
)

function buildColumns(cols: number): GridColumn[] {
  return Array.from({ length: cols }, (_, index) => {
    const kind = KINDS[index % KINDS.length] as (typeof KINDS)[number]
    const key = columnKey(index)
    const meta =
      kind === 'amount' || kind === 'qty'
        ? { label: key, variant: 'number' as const }
        : kind === 'stage'
          ? {
              editable: true,
              label: key,
              options: STAGES,
              variant: 'select' as const,
            }
          : kind === 'status'
            ? { label: key, variant: 'badge' as const }
            : kind === 'created'
              ? { label: key, variant: 'date' as const }
              : { label: key }
    return {
      accessorKey: key,
      cell: renderCell,
      header: key,
      meta,
    } as GridColumn
  })
}

function buildRows(rows: number, cols: number): Row[] {
  const random = seededRandom(SEED)
  const keys = Array.from({ length: cols }, (_, index) => columnKey(index))
  return Array.from({ length: rows }, (_, rowIndex) => {
    const region = `Region ${Math.floor((rowIndex * GROUPS) / rows)}`
    const row: Row = { id: `row-${rowIndex}`, region }
    for (const key of keys) {
      if (key.startsWith('id')) row[key] = `ID-${rowIndex}`
      else if (key.startsWith('name'))
        row[key] = `Name ${Math.floor(random() * 1e6)}`
      else if (key.startsWith('amount') || key.startsWith('qty'))
        row[key] = Math.floor(random() * 100_000) / 100
      else if (key.startsWith('stage'))
        row[key] = STAGES[Math.floor(random() * STAGES.length)]?.value ?? 'open'
      else if (key.startsWith('status'))
        row[key] = BADGES[Math.floor(random() * BADGES.length)] ?? 'default'
      else if (key.startsWith('created'))
        row[key] = new Date(Date.UTC(2026, 0, 1 + Math.floor(random() * 365)))
          .toISOString()
          .slice(0, 10)
      else if (key.startsWith('region')) row[key] = `Region ${rowIndex % 7}`
      else row[key] = `Value ${Math.floor(random() * 1e6)}`
    }
    row.region = region
    return row
  })
}

const getRowId = (row: Row) => row.id
const getRowGroup = (row: Row) => row.region
const noop = () => undefined

interface GridProps {
  columns: GridColumn[]
  data: Row[]
  grouped: boolean
  tableRef: Handle['tableRef']
}

function Grid({ columns, data, grouped, tableRef }: GridProps): ReactElement {
  const { table } = useDataGrid<Row>({
    columns,
    data,
    getRowId,
    onCellValueChange: noop,
  })
  tableRef.current = table as GridTable
  return createElement(DataGrid<Row>, {
    'aria-label': 'Bench',
    getRowGroup: grouped ? getRowGroup : undefined,
    table: table as GridTable,
  })
}

function Parent(props: GridProps): ReactElement {
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
    createElement(Grid, props),
  )
}

const dataRows = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="data-grid-row"]'),
  )

const cellAt = (container: HTMLElement, row: number, column: number) => {
  const cell = dataRows(container)[row]?.querySelectorAll<HTMLElement>(
    '[data-slot="data-grid-cell"]',
  )[column]
  if (!cell) throw new Error(`cell ${row}:${column} not found`)
  return cell
}

const activeCell = () => {
  const cell = document.activeElement?.closest<HTMLElement>(
    '[data-slot="data-grid-cell"]',
  )
  if (!cell) throw new Error('no focused cell')
  return cell
}

const groupToggle = (container: HTMLElement, index: number) => {
  const button = container.querySelectorAll<HTMLElement>(
    '[data-slot="data-grid-group-row"] button',
  )[index]
  if (!button) throw new Error(`group toggle ${index} not found`)
  return button
}

const VERTICAL = ['ArrowDown', 'ArrowUp']
const HORIZONTAL = ['ArrowRight', 'ArrowLeft']

const gridCase = (rows: number, cols: number, grouped: boolean) => {
  const columns = buildColumns(cols)
  const data = buildRows(rows, cols)
  return {
    id: `${rows}x${cols}${grouped ? ' grouped' : ''}`,
    mount(container: HTMLElement, tools: MountTools): Handle {
      const tableRef: Handle['tableRef'] = { current: null }
      tools.render(createElement(Parent, { columns, data, grouped, tableRef }))
      return { container, tableRef }
    },
  }
}

const flat = ['200x10', '1000x20']
const grouped = ['200x10 grouped', '1000x20 grouped']

const bench = createBench<Handle>({
  cases: [
    gridCase(200, 10, false),
    gridCase(200, 10, true),
    gridCase(1000, 20, false),
    gridCase(1000, 20, true),
  ],
  mount: { iterations: 2 },
  name: 'data-grid',
  scenarios: [
    {
      cases: flat,
      name: 'focus move vertical',
      run: (_handle, { index }) =>
        fire.keyDown(activeCell(), { key: VERTICAL[index % 2] }),
      setup: (handle) => fire.click(cellAt(handle.container, 1, 2)),
    },
    {
      cases: flat,
      name: 'focus move horizontal',
      run: (_handle, { index }) =>
        fire.keyDown(activeCell(), { key: HORIZONTAL[index % 2] }),
      setup: (handle) => fire.click(cellAt(handle.container, 1, 2)),
    },
    {
      cases: flat,
      name: 'select click',
      run: (handle, { index }) =>
        fire.click(cellAt(handle.container, 2 + index, 3)),
    },
    {
      cases: flat,
      name: 'select shift-click',
      run: (handle, { index }) =>
        fire.click(cellAt(handle.container, 3 + index, 4), { shiftKey: true }),
      setup: (handle) => fire.click(cellAt(handle.container, 0, 3)),
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
      cases: grouped,
      name: 'group collapse',
      run: (handle, { index }) =>
        fire.click(groupToggle(handle.container, index)),
    },
    {
      cases: grouped,
      name: 'group expand',
      run: (handle, { index }) =>
        fire.click(groupToggle(handle.container, index)),
      setup: async (handle) => {
        for (let group = 0; group < GROUPS; group++) {
          await act(async () => {
            fire.click(groupToggle(handle.container, group))
          })
        }
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
