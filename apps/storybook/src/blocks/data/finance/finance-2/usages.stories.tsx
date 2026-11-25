import type { Meta, StoryObj } from '@storybook/react-vite'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  Finance2,
  type Finance2Filters,
  type Finance2Sort,
} from '@tc96/ui/blocks/data/finance/finance-2'
import { useMemo, useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import {
  type Finance2Page,
  finance2Handlers,
} from '../../../../mocks/finance-2.ts'
import {
  emptyFilters,
  finance2PageSize,
  initialSort,
} from '../fixtures/finance-2.ts'

const pagePath = (
  cursor: number,
  sort: Finance2Sort | null,
  filters: Finance2Filters,
  search: string,
) => {
  const params = new URLSearchParams({
    ...filters,
    cursor: String(cursor),
    limit: String(finance2PageSize),
    search,
  })
  if (sort) {
    params.set('sort', sort.key)
    params.set('direction', sort.direction)
  }
  return `/data/table/transactions?${params}`
}

const TransactionsLedger = () => {
  const [sort, setSort] = useState<Finance2Sort | null>(initialSort)
  const [filters, setFilters] = useState<Finance2Filters>(emptyFilters)
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
    getNextPageParam: (page: Finance2Page) => page.nextCursor,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchJson<Finance2Page>(pagePath(pageParam, sort, filters, search)),
    queryKey: ['data', 'table', 'transactions', sort, filters, search],
  })
  const transactions = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  return (
    <Finance2
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
  title: 'Blocks/Data/Finance/Finance2/Usages',
} satisfies Meta<typeof TransactionsLedger>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance2Handlers.loaded)
  },
}

export const ScrollLoadsTheNextPage: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance2Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance2Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance2Handlers.pending)
  },
}
