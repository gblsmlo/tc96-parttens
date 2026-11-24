import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataTable,
  type DataTableColumnDef,
  useDataTable,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, waitFor, within } from 'storybook/test'
import { sleep } from '../../../../test-utils/sleep'
import { DataTableCanvas } from './data-table-canvas.tsx'

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Behavior',
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

const columns: DataTableColumnDef<Transaction>[] = [
  { accessorKey: 'memo', header: 'Descrição' },
  { accessorKey: 'amount', header: 'Valor' },
]

const onEndReached = fn()

function LedgerTable({
  initialCount = PAGE,
  loadMore = false,
  loadingMore = false,
}: Readonly<{
  initialCount?: number
  loadMore?: boolean
  loadingMore?: boolean
}>) {
  const [data, setData] = useState(() => transactionsFrom(0, initialCount))
  const [loading, setLoading] = useState(false)
  const { table } = useDataTable<Transaction>({
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
    <div className="flex h-80 flex-col">
      <DataTable<Transaction>
        aria-label="Extrato"
        loadingMore={loadingMore || loading}
        onEndReached={handleEndReached}
        table={table}
      />
    </div>
  )
}

const tableOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('table', { name: 'Extrato' })

const viewportOf = (canvasElement: HTMLElement) => {
  const viewport = canvasElement.querySelector<HTMLElement>(
    '[data-slot="data-table-viewport"]',
  )
  if (!viewport) throw new Error('The table viewport is missing.')
  return viewport
}

const scrollTo = async (viewport: HTMLElement, top: number) => {
  viewport.scrollTop = top
  await sleep(120)
}

const scrollToEnd = (viewport: HTMLElement) =>
  scrollTo(viewport, viewport.scrollHeight - viewport.clientHeight)

const loadingMoreRows = (table: HTMLElement) =>
  table.querySelectorAll('[data-loading-more="true"]')

export const EndReachedStaysQuietAwayFromTheEnd: Story = {
  render: () => <LedgerTable />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const viewport = viewportOf(canvasElement)
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    await scrollTo(viewport, 40)
    await expect(onEndReached).not.toHaveBeenCalled()
  },
}

export const EndReachedFiresOncePerDataLength: Story = {
  render: () => <LedgerTable loadMore />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const viewport = viewportOf(canvasElement)
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    await scrollToEnd(viewport)
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(
        tableOf(canvasElement).querySelectorAll(
          'tbody tr[data-slot="table-row"]:not([data-loading-more])',
        ),
      ).toHaveLength(PAGE * 2),
    )

    await scrollToEnd(viewport)
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(2))
  },
}

export const EndReachedFiresWhenTheRowsDoNotFillTheViewport: Story = {
  render: () => {
    onEndReached.mockClear()
    return <LedgerTable initialCount={3} />
  },
  play: async () => {
    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1))
  },
}

export const LoadingMoreAppendsSkeletonRows: Story = {
  render: () => <LedgerTable loadingMore />,
  play: async ({ canvasElement }) => {
    onEndReached.mockClear()
    const table = tableOf(canvasElement)
    await expect(loadingMoreRows(table)).toHaveLength(3)
    await expect(table).toHaveAttribute('aria-busy', 'true')
    const rows = [...table.querySelectorAll('tbody tr')]
    await expect(rows.indexOf(loadingMoreRows(table)[0] as Element)).toBe(PAGE)

    await scrollToEnd(viewportOf(canvasElement))
    await sleep(200)
    await expect(onEndReached).not.toHaveBeenCalled()
  },
}
