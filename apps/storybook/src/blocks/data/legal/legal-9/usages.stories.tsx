import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Legal9,
  type Legal9BillingModel,
  type Legal9GroupBy,
  type Legal9Mode,
  type Legal9Record,
  type Legal9Sort,
  type Legal9Status,
} from '@tc96/ui/blocks/data/legal/legal-9'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal9Handlers } from '../../../../mocks/legal-9.ts'
import {
  type Legal9Page,
  owners,
  pageSize,
  savedViews,
} from '../fixtures/legal-9.ts'

const FeeContracts = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Legal9Mode>('table')
  const [groupBy, setGroupBy] = useState<Legal9GroupBy | null>(null)
  const [sort, setSort] = useState<Legal9Sort>('updated')
  const [statusFilter, setStatusFilter] = useState<Legal9Status | null>(null)
  const [billingModelFilter, setBillingModelFilter] =
    useState<Legal9BillingModel | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(page),
    sort,
  })
  if (statusFilter) params.set('status', statusFilter)
  if (billingModelFilter) params.set('billingModel', billingModelFilter)
  if (ownerFilter) params.set('ownerId', ownerFilter)
  const queryKey = ['data', 'legal', 'fee-contracts', params.toString()]

  const { data, isError, isPending, refetch } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Legal9Page>(`/data/legal/fee-contracts?${params.toString()}`),
    queryKey,
  })
  const update = (ids: readonly string[], change: Partial<Legal9Record>) =>
    queryClient.setQueryData<Legal9Page>(queryKey, (current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              ids.includes(item.id) ? { ...item, ...change } : item,
            ),
          }
        : current,
    )
  const firstPage = () => setPage(1)

  return (
    <Legal9
      billingModelFilter={billingModelFilter}
      error={isError}
      filtered={Boolean(statusFilter || billingModelFilter || ownerFilter)}
      groupBy={groupBy}
      mode={mode}
      onBillingModelChange={(id, billingModel) =>
        update([id], { billingModel })
      }
      onBillingModelFilterChange={(next) => {
        setBillingModelFilter(next)
        firstPage()
      }}
      onBulkBillingModelChange={(ids, billingModel) =>
        update(ids, { billingModel })
      }
      onBulkOwnerChange={(ids, ownerId) => update(ids, { ownerId })}
      onDefaultViewSelect={() => setSavedViewId(null)}
      onGroupByChange={setGroupBy}
      onModeChange={setMode}
      onOwnerChange={(id, ownerId) => update([id], { ownerId })}
      onOwnerFilterChange={(next) => {
        setOwnerFilter(next)
        firstPage()
      }}
      onPageChange={setPage}
      onRetry={() => refetch()}
      onSavedViewSelect={setSavedViewId}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={setSort}
      onStatusFilterChange={(next) => {
        setStatusFilter(next)
        firstPage()
      }}
      ownerFilter={ownerFilter}
      owners={owners}
      page={page}
      pageCount={Math.max(1, Math.ceil((data?.total ?? 0) / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      records={data?.items ?? []}
      savedViewId={savedViewId}
      savedViews={savedViews}
      selectedIds={selectedIds}
      sort={sort}
      statusFilter={statusFilter}
      total={data?.total}
    />
  )
}

const meta = {
  component: FeeContracts,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal9/Usages',
} satisfies Meta<typeof FeeContracts>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal9Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal9Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal9Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal9Handlers.error)
  },
}
