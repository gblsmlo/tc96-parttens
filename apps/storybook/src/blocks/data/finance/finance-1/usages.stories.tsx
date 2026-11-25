import type { Meta, StoryObj } from '@storybook/react-vite'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  Finance1,
  type Finance1Filters,
  type Finance1Sort,
} from '@tc96/ui/blocks/data/finance/finance-1'
import { useMemo, useState } from 'react'
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

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.loaded)
  },
}

export const ScrollLoadsTheNextPage: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance1Handlers.pending)
  },
}
