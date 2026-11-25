import type { Meta, StoryObj } from '@storybook/react-vite'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  Finance1,
  type Finance1Filters,
  type Finance1Sort,
} from '@tc96/ui/blocks/data/finance/finance-1'
import { useMemo, useState } from 'react'
import { expect, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import {
  type Finance1Page,
  finance1Handlers,
} from '../../../../mocks/finance-1.ts'
import {
  emptyFilters,
  finance1PageSize,
  initialSort,
} from '../fixtures/finance-1.ts'

const pagePath = (
  cursor: number,
  sort: Finance1Sort | null,
  filters: Finance1Filters,
  search: string,
) => {
  const params = new URLSearchParams({
    ...filters,
    cursor: String(cursor),
    limit: String(finance1PageSize),
    search,
  })
  if (sort) {
    params.set('sort', sort.key)
    params.set('direction', sort.direction)
  }
  return `/data/transactions?${params}`
}

const TransactionsLedger = () => {
  const [sort, setSort] = useState<Finance1Sort | null>(initialSort)
  const [filters, setFilters] = useState<Finance1Filters>(emptyFilters)
  const [search, setSearch] = useState('')
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    getNextPageParam: (page: Finance1Page) => page.nextCursor,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchJson<Finance1Page>(pagePath(pageParam, sort, filters, search)),
    queryKey: ['data', 'transactions', sort, filters, search],
  })
  const transactions = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  return (
    <Finance1
      error={isError}
      filters={filters}
      hasMore={hasNextPage}
      loadingMore={isFetchingNextPage}
      onFiltersChange={setFilters}
      onLoadMore={() => fetchNextPage()}
      onRefresh={() => refetch()}
      onRetry={() => refetch()}
      onSearchChange={setSearch}
      onSortChange={setSort}
      pending={isPending}
      refreshing={isRefetching && !isFetchingNextPage}
      search={search}
      sort={sort}
      totalCount={data?.pages[0]?.total ?? 0}
      transactions={transactions}
    />
  )
}

const meta = {
  component: TransactionsLedger,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Finance/Finance1/Usages',
} satisfies Meta<typeof TransactionsLedger>

export default meta

type Story = StoryObj<typeof meta>

const headerOf = (canvasElement: HTMLElement) =>
  within(canvasElement).queryByRole('toolbar', {
    name: 'Controles das transações',
  })

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('grid')).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await waitFor(() =>
      expect(headerOf(canvasElement)).toHaveTextContent(
        '40 de 10.000 carregadas',
      ),
    )
  },
}

export const ScrollLoadsTheNextPage: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const grid = await within(canvasElement).findByRole('grid')
    grid.scrollTop = grid.scrollHeight
    grid.dispatchEvent(new Event('scroll'))
    await waitFor(() =>
      expect(headerOf(canvasElement)).toHaveTextContent(
        '80 de 10.000 carregadas',
      ),
    )
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma transação para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as transações',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando transações'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Transações' }),
    ).toBeVisible()
  },
}
