import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { performance } from 'node:perf_hooks'
import { createElement, Profiler, type ReactElement } from 'react'
import type {
  DataGridColumnDef,
  DataGridTable,
} from '../packages/parttens/src/collection-views/views/data-grid'

await import('../packages/parttens/src/collection-views/test/dom')

const { act, cleanup, fireEvent, render } = await import(
  '@testing-library/react'
)
const { DataGrid, DataGridCell, useDataGrid } = await import(
  '../packages/parttens/src/collection-views/views/data-grid'
)
type Row = Record<string, string | number> & { id: string; region: string }

interface Sample {
  cells: number
  heapMb?: number
  profilerMs: number
  wallMs: number
}

interface Stats {
  cellsMedian: number
  heapMbMedian?: number
  profilerMedianMs: number
  profilerP95Ms: number
  wallMedianMs: number
  wallP95Ms: number
}

interface Result extends Stats {
  caseId: string
  iterations: number
  scenario: string
}

interface CaseSpec {
  cols: number
  grouped: boolean
  rows: number
}

const args = process.argv.slice(2)
const flag = (name: string) => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}
const ITERATIONS = Number(process.env.BENCH_ITERATIONS ?? 3)
const MOUNT_ITERATIONS = Number(process.env.BENCH_MOUNT_ITERATIONS ?? 2)
const WARMUP = Number(process.env.BENCH_WARMUP ?? 1)
const GROUPS = 10

const counters = { cells: 0, profilerMs: 0 }

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

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

function buildColumns(cols: number): DataGridColumnDef<Row>[] {
  return Array.from({ length: cols }, (_, index) => {
    const kind = KINDS[index % KINDS.length] as (typeof KINDS)[number]
    const key = `${kind}${index < KINDS.length ? '' : `_${Math.floor(index / KINDS.length)}`}`
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
      cell: (context) => {
        counters.cells += 1
        return createElement(DataGridCell<Row>, { context })
      },
      header: key,
      meta,
    } satisfies DataGridColumnDef<Row>
  })
}

function buildRows(rows: number, cols: number): Row[] {
  const random = createRandom(96)
  const keys = buildColumns(cols).map(
    (column) => (column as { accessorKey: string }).accessorKey,
  )
  return Array.from({ length: rows }, (_, rowIndex) => {
    const row: Row = {
      id: `row-${rowIndex}`,
      region: `Region ${Math.floor((rowIndex * GROUPS) / rows)}`,
    }
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
    row.region = `Region ${Math.floor((rowIndex * GROUPS) / rows)}`
    return row
  })
}

const tableRef: { current: DataGridTable<Row> | null } = { current: null }
const noop = () => undefined

function Harness({
  columns,
  data,
  grouped,
}: Readonly<{
  columns: DataGridColumnDef<Row>[]
  data: Row[]
  grouped: boolean
}>): ReactElement {
  const { table } = useDataGrid<Row>({
    columns,
    data,
    getRowId: (row) => row.id,
    onCellValueChange: noop,
  })
  tableRef.current = table as DataGridTable<Row>

  return createElement(
    Profiler,
    {
      id: 'data-grid',
      onRender: (_id, _phase, actualDuration) => {
        counters.profilerMs += actualDuration
      },
    },
    createElement(DataGrid<Row>, {
      'aria-label': 'Bench',
      getRowGroup: grouped ? (row: Row) => row.region : undefined,
      table,
    }),
  )
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[middle] as number)
    : ((sorted[middle - 1] as number) + (sorted[middle] as number)) / 2
}

function percentile95(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[
    Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)
  ] as number
}

function summarize(samples: Sample[]): Stats {
  const heap = samples.flatMap((sample) =>
    sample.heapMb === undefined ? [] : [sample.heapMb],
  )
  return {
    cellsMedian: median(samples.map((sample) => sample.cells)),
    ...(heap.length ? { heapMbMedian: median(heap) } : {}),
    profilerMedianMs: median(samples.map((sample) => sample.profilerMs)),
    profilerP95Ms: percentile95(samples.map((sample) => sample.profilerMs)),
    wallMedianMs: median(samples.map((sample) => sample.wallMs)),
    wallP95Ms: percentile95(samples.map((sample) => sample.wallMs)),
  }
}

async function measure(action: () => void | Promise<void>): Promise<Sample> {
  counters.cells = 0
  counters.profilerMs = 0
  const start = performance.now()
  await act(async () => {
    await action()
  })
  const wallMs = performance.now() - start
  return { cells: counters.cells, profilerMs: counters.profilerMs, wallMs }
}

function heapMb() {
  Bun.gc(true)
  Bun.gc(true)
  return process.memoryUsage().heapUsed / 1024 / 1024
}

function dataRows(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="data-grid-row"]'),
  )
}

function cellAt(container: HTMLElement, row: number, column: number) {
  const cell = dataRows(container)[row]?.querySelectorAll<HTMLElement>(
    '[data-slot="data-grid-cell"]',
  )[column]
  if (!cell) throw new Error(`cell ${row}:${column} not found`)
  return cell
}

function activeCell() {
  const cell = document.activeElement?.closest<HTMLElement>(
    '[data-slot="data-grid-cell"]',
  )
  if (!cell) throw new Error('no focused cell')
  return cell
}

async function repeat(
  count: number,
  run: (index: number) => Promise<Sample>,
  warmup = WARMUP,
): Promise<Sample[]> {
  const samples: Sample[] = []
  for (let index = 0; index < warmup + count; index++) {
    const sample = await run(index)
    if (index >= warmup) samples.push(sample)
  }
  return samples
}

async function runCase(spec: CaseSpec): Promise<Result[]> {
  const caseId = `${spec.rows}x${spec.cols}${spec.grouped ? ' grouped' : ''}`
  const columns = buildColumns(spec.cols)
  const data = buildRows(spec.rows, spec.cols)
  const element = createElement(Harness, {
    columns,
    data,
    grouped: spec.grouped,
  })
  const results: Result[] = []
  const push = (scenario: string, samples: Sample[]) => {
    console.error(`done ${caseId} | ${scenario}`)
    results.push({
      ...summarize(samples),
      caseId,
      iterations: samples.length,
      scenario,
    })
  }

  cleanup()
  let mounted: ReturnType<typeof render> | undefined
  if (spec.grouped) {
    const sample = await measure(() => {
      mounted = render(element)
    })
    push('mount (cold, n=1)', [sample])
  } else {
    const mountSamples = await repeat(
      MOUNT_ITERATIONS,
      async () => {
        cleanup()
        const before = heapMb()
        const sample = await measure(() => {
          render(element)
        })
        const after = heapMb()
        cleanup()
        return { ...sample, heapMb: after - before }
      },
      0,
    )
    push('mount', mountSamples)
    cleanup()
    mounted = render(element)
  }
  const container = (mounted as ReturnType<typeof render>).container
  const toggleFirst = (key: string) => {
    const label = tableRef.current?.getColumn(key)
    if (!label) throw new Error(`column ${key} not found`)
    return label
  }

  if (!spec.grouped) {
    fireEvent.click(cellAt(container, 1, 2))
    await act(async () => {
      await Promise.resolve()
    })
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']
    push(
      'focus move',
      await repeat(ITERATIONS, (index) =>
        measure(async () => {
          fireEvent.keyDown(activeCell(), { key: keys[index % 4] })
          await Promise.resolve()
        }),
      ),
    )

    push(
      'select click',
      await repeat(ITERATIONS, (index) =>
        measure(() => {
          fireEvent.click(cellAt(container, 2 + index, 3))
        }),
      ),
    )

    fireEvent.click(cellAt(container, 0, 3))
    push(
      'select shift-click',
      await repeat(ITERATIONS, (index) =>
        measure(() => {
          fireEvent.click(cellAt(container, 3 + index, 4), { shiftKey: true })
        }),
      ),
    )

    push(
      'sort toggle',
      await repeat(ITERATIONS, (index) =>
        measure(() => {
          toggleFirst('name').toggleSorting(index % 2 === 1)
        }),
      ),
    )
  } else {
    const toggle = () => {
      const button = container.querySelector<HTMLElement>(
        '[data-slot="data-grid-group-row"] button',
      )
      if (!button) throw new Error('group toggle not found')
      return button
    }
    push(
      'group collapse toggle',
      await repeat(ITERATIONS, () =>
        measure(() => {
          fireEvent.click(toggle())
        }),
      ),
    )
  }
  cleanup()
  return results
}

const SPECS: CaseSpec[] = [
  { cols: 10, grouped: false, rows: 200 },
  { cols: 10, grouped: true, rows: 200 },
  { cols: 20, grouped: false, rows: 1000 },
  { cols: 20, grouped: true, rows: 1000 },
]

const results: Result[] = []
for (const spec of SPECS) results.push(...(await runCase(spec)))

const fixed = (value: number | undefined, digits = 1) =>
  value === undefined ? '-' : value.toFixed(digits)
const resultKey = (result: Result) => `${result.caseId} | ${result.scenario}`

const comparePath = flag('--compare')
const baseline = comparePath
  ? new Map(
      (
        JSON.parse(await readFile(comparePath, 'utf8')) as { results: Result[] }
      ).results.map((result) => [resultKey(result), result]),
    )
  : null
const delta = (current: number, previous: number | undefined) =>
  previous === undefined || previous === 0
    ? '-'
    : `${(((current - previous) / previous) * 100).toFixed(0)}%`

const header = [
  'case',
  'scenario',
  'n',
  'wall med',
  'wall p95',
  'prof med',
  'prof p95',
  'cells',
  'heap MB',
  ...(baseline ? ['d wall', 'd prof', 'd cells', 'd heap'] : []),
]
const table = results.map((result) => {
  const before = baseline?.get(resultKey(result))
  return [
    result.caseId,
    result.scenario,
    String(result.iterations),
    fixed(result.wallMedianMs),
    fixed(result.wallP95Ms),
    fixed(result.profilerMedianMs),
    fixed(result.profilerP95Ms),
    fixed(result.cellsMedian, 0),
    fixed(result.heapMbMedian),
    ...(baseline
      ? [
          delta(result.wallMedianMs, before?.wallMedianMs),
          delta(result.profilerMedianMs, before?.profilerMedianMs),
          delta(result.cellsMedian, before?.cellsMedian),
          delta(result.heapMbMedian ?? 0, before?.heapMbMedian),
        ]
      : []),
  ]
})
const widths = header.map((title, column) =>
  Math.max(title.length, ...table.map((line) => (line[column] ?? '').length)),
)
const format = (line: string[]) =>
  line
    .map((value, column) =>
      column < 2
        ? value.padEnd(widths[column] ?? 0)
        : value.padStart(widths[column] ?? 0),
    )
    .join('  ')
console.log(
  `ms unless noted; iterations=${ITERATIONS} mount=${MOUNT_ITERATIONS} (no warmup) warmup=${WARMUP}`,
)
console.log(format(header))
console.log(widths.map((width) => '-'.repeat(width)).join('  '))
for (const line of table) console.log(format(line))

const jsonPath = flag('--json')
if (jsonPath) {
  await mkdir(dirname(jsonPath), { recursive: true })
  await writeFile(
    jsonPath,
    `${JSON.stringify({ iterations: ITERATIONS, mountIterations: MOUNT_ITERATIONS, results, warmup: WARMUP }, null, 2)}\n`,
  )
}
process.exit(0)
