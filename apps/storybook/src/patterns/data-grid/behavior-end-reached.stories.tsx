import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataGrid,
  type DataGridColumnDef,
  useDataGrid,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, waitFor, within } from 'storybook/test'
import { sleep } from '../../test-utils/sleep'
import { DataGridCanvas } from './data-grid-canvas.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface Transaction {
  amount: number
  id: string
  memo: string
}

const PAGE = 25

const transactionsFrom = (start: number, count: number): Transaction[] =>
  Array.from({ length: count }, (_, index) => ({
    amount: (start + index) * 10,
    id: `tx-${start + index + 1}`,
    memo: `Lançamento ${start + index + 1}`,
  }))

const columns: DataGridColumnDef<Transaction>[] = [
  {
    accessorKey: 'memo',
    header: 'Descrição',
    meta: { label: 'Descrição' },
    size: 260,
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    meta: { align: 'end', label: 'Valor', variant: 'number' },
    size: 140,
  },
]

const onEndReached = fn()

function LedgerGrid({
  endReachedThreshold,
  initialCount = PAGE,
  loadMore = false,
  loadingMore = false,
  virtualize = false,
}: Readonly<{
  endReachedThreshold?: number
  initialCount?: number
  loadMore?: boolean
  loadingMore?: boolean
  virtualize?: boolean
}>) {
  const [data, setData] = useState(() => transactionsFrom(0, initialCount))
  const [loading, setLoading] = useState(false)
  const { table } = useDataGrid<Transaction>({
    columns,
    data,
    getRowId: (transaction) => transaction.id,
  })

  const handleEndReached = () => {
    onEndReached()
    if (!loadMore) return
    setLoading(true)
    sleep(150).then(() => {
      setData((current) => [
        ...current,
        ...transactionsFrom(current.length, PAGE),
      ])
      setLoading(false)
    })
  }

  return (
    <DataGrid<Transaction>
      aria-label="Extrato"
      loadingMore={loadingMore || loading}
      maxHeight={320}
      onEndReached={handleEndReached}
      table={table}
      virtualize={virtualize}
      {...(endReachedThreshold === undefined ? {} : { endReachedThreshold })}
    />
  )
}

const gridOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('grid', { name: 'Extrato' })

const scrollTo = async (grid: HTMLElement, top: number) => {
  grid.scrollTop = top
  await sleep(120)
}

const scrollToEnd = (grid: HTMLElement) =>
  scrollTo(grid, grid.scrollHeight - grid.clientHeight)

const loadingMoreRows = (grid: HTMLElement) =>
  grid.querySelectorAll('[data-loading-more="true"]')

export const StaysQuietAwayFromTheEnd: Story = {
  render: () => <LedgerGrid />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const grid = gridOf(canvasElement)
    await waitFor(() =>
      expect(grid.scrollHeight).toBeGreaterThan(grid.clientHeight),
    )
    await scrollTo(grid, 100)
    await expect(onEndReached).not.toHaveBeenCalled()
  },
}

export const FiresOnceWhenTheLastRowsAppear: Story = {
  render: () => <LedgerGrid />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const grid = gridOf(canvasElement)
    await scrollToEnd(grid)
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1))

    await scrollTo(grid, grid.scrollHeight - grid.clientHeight - 20)
    await scrollToEnd(grid)
    await expect(onEndReached).toHaveBeenCalledTimes(1)
  },
}

export const FiresAgainWhenTheDataGrows: Story = {
  render: () => <LedgerGrid loadMore />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const grid = gridOf(canvasElement)
    await scrollToEnd(grid)
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(grid.querySelectorAll('[data-slot="data-grid-row"]')).toHaveLength(
        PAGE * 2,
      ),
    )

    await scrollToEnd(grid)
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(2))
  },
}

export const FiresRightAwayWhenTheRowsDoNotFillTheViewport: Story = {
  render: () => {
    onEndReached.mockClear()
    return <LedgerGrid initialCount={3} />
  },
  play: async () => {
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1))
  },
}

export const ThresholdSetsHowManyRowsFromTheEnd: Story = {
  render: () => <LedgerGrid endReachedThreshold={2} />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const grid = gridOf(canvasElement)
    const end = grid.scrollHeight - grid.clientHeight
    await scrollTo(grid, end - 8 * 36)
    await expect(onEndReached).not.toHaveBeenCalled()

    await scrollTo(grid, end - 36)
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1))
  },
}

export const VirtualizedGridFiresAtTheEnd: Story = {
  render: () => <LedgerGrid virtualize />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const grid = gridOf(canvasElement)
    await waitFor(() =>
      expect(grid.scrollHeight).toBeGreaterThan(grid.clientHeight),
    )
    await scrollTo(grid, 100)
    await expect(onEndReached).not.toHaveBeenCalled()

    await scrollToEnd(grid)
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1))
  },
}

export const LoadingMoreRendersSkeletonRowsAfterTheLastRow: Story = {
  render: () => <LedgerGrid loadingMore />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    await expect(loadingMoreRows(grid)).toHaveLength(3)
    await expect(grid).toHaveAttribute('aria-busy', 'true')

    const rows = [...grid.querySelectorAll('[role="row"]')]
    const lastRealRow = [
      ...grid.querySelectorAll('[data-slot="data-grid-row"]'),
    ].at(-1)
    await expect(rows.indexOf(loadingMoreRows(grid)[0] as Element)).toBe(
      rows.indexOf(lastRealRow as Element) + 1,
    )
    await expect(grid).toHaveAttribute('aria-rowcount', String(1 + PAGE + 3))
    await expect(
      [...loadingMoreRows(grid)].map((row) =>
        row.getAttribute('aria-rowindex'),
      ),
    ).toEqual([String(PAGE + 2), String(PAGE + 3), String(PAGE + 4)])
  },
}

export const LoadingMoreSuppressesFurtherCalls: Story = {
  render: () => <LedgerGrid loadingMore />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const grid = gridOf(canvasElement)
    await scrollToEnd(grid)
    await sleep(200)
    await expect(onEndReached).not.toHaveBeenCalled()
  },
}

export const VirtualizedLoadingMoreSitsBelowTheLastRow: Story = {
  render: () => <LedgerGrid loadingMore virtualize />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    await scrollToEnd(grid)
    await waitFor(() => expect(loadingMoreRows(grid)).toHaveLength(3))

    const lastRow = [
      ...grid.querySelectorAll('[data-slot="data-grid-row"]'),
    ].at(-1)
    const skeleton = loadingMoreRows(grid)[0]
    await expect(lastRow?.textContent).toContain(`Lançamento ${PAGE}`)
    await expect(skeleton?.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      lastRow?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
    )
  },
}
