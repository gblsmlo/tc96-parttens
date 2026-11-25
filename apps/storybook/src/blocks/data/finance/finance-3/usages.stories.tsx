import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Finance3,
  type Finance3Entry,
  type Finance3Situation,
  type Finance3View,
} from '@tc96/ui/blocks/data/finance/finance-3'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { finance3Handlers } from '../../../../mocks/finance-3.ts'
import {
  accounts,
  categories,
  type Finance3ClientMoneyPage,
  type Finance3EntriesPage,
  type Finance3ReceivablesPage,
  type Finance3StatementPage,
  members,
  pageSize,
  periods,
} from '../fixtures/finance-3.ts'

const LedgerPage = ({
  initialView = 'all',
}: {
  initialView?: Finance3View
}) => {
  const queryClient = useQueryClient()
  const [view, setView] = useState<Finance3View>(initialView)
  const [situationFilter, setSituationFilter] =
    useState<Finance3Situation | null>(null)
  const [accountFilter, setAccountFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const queue = view === 'collection'

  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(page),
    view,
  })
  if (situationFilter) params.set('situation', situationFilter)
  if (accountFilter) params.set('accountId', accountFilter)
  const entriesKey = ['data', 'finance', 'entries', params.toString()]

  const entriesQuery = useQuery({
    enabled: !queue,
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Finance3EntriesPage>(
        `/data/finance/entries?${params.toString()}`,
      ),
    queryKey: entriesKey,
  })
  const queueQuery = useQuery({
    enabled: queue,
    queryFn: () =>
      fetchJson<Finance3ReceivablesPage>('/data/finance/collection-queue'),
    queryKey: ['data', 'finance', 'collection-queue'],
  })
  const updateEntries = (
    ids: readonly string[],
    change: Partial<Finance3Entry>,
  ) =>
    queryClient.setQueryData<Finance3EntriesPage>(entriesKey, (current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              ids.includes(item.id) ? { ...item, ...change } : item,
            ),
          }
        : current,
    )
  const changeView = (next: Finance3View) => {
    setView(next)
    setPage(1)
    setSelectedIds([])
  }

  if (queue) {
    const items = queueQuery.data?.items ?? []
    const visible = items.slice((page - 1) * pageSize, page * pageSize)
    return (
      <Finance3
        counts={queueQuery.data?.counts}
        error={queueQuery.isError}
        onMarkCollected={(ids) =>
          queryClient.setQueryData<Finance3ReceivablesPage>(
            ['data', 'finance', 'collection-queue'],
            (current) =>
              current
                ? {
                    ...current,
                    items: current.items.filter(
                      (item) => !ids.includes(item.id),
                    ),
                  }
                : current,
          )
        }
        onPageChange={setPage}
        onRetry={() => queueQuery.refetch()}
        onSelectedIdsChange={setSelectedIds}
        onViewChange={changeView}
        page={page}
        pageCount={Math.max(1, Math.ceil(items.length / pageSize))}
        pageSize={pageSize}
        pending={queueQuery.isPending}
        records={visible}
        selectedIds={selectedIds}
        total={items.length}
        truncated={queueQuery.data?.truncated}
        variant="receivables"
        view={view}
      />
    )
  }

  return (
    <Finance3
      accountFilter={accountFilter}
      accounts={accounts}
      categories={categories}
      counts={entriesQuery.data?.counts}
      error={entriesQuery.isError}
      filtered={Boolean(situationFilter || accountFilter)}
      members={members}
      onAccountChange={(id, accountId) => updateEntries([id], { accountId })}
      onAccountFilterChange={(next) => {
        setAccountFilter(next)
        setPage(1)
      }}
      onBulkResponsibleChange={(ids, responsibleId) =>
        updateEntries(ids, { responsibleId })
      }
      onBulkSettle={(ids, accountId) =>
        updateEntries(ids, {
          accountId,
          canEdit: false,
          canSettle: false,
          situation: 'settled',
        })
      }
      onPageChange={setPage}
      onResponsibleChange={(id, responsibleId) =>
        updateEntries([id], { responsibleId })
      }
      onRetry={() => entriesQuery.refetch()}
      onSelectedIdsChange={setSelectedIds}
      onSituationFilterChange={(next) => {
        setSituationFilter(next)
        setPage(1)
      }}
      onViewChange={changeView}
      page={page}
      pageCount={Math.max(
        1,
        Math.ceil((entriesQuery.data?.total ?? 0) / pageSize),
      )}
      pageSize={pageSize}
      pending={entriesQuery.isPending}
      records={entriesQuery.data?.items ?? []}
      selectedIds={selectedIds}
      situationFilter={situationFilter}
      total={entriesQuery.data?.total}
      variant="entries"
      view={view}
    />
  )
}

const StatementPage = () => {
  const [period, setPeriod] = useState<string | null>('month')
  const [page, setPage] = useState(1)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<Finance3StatementPage>(
        `/data/finance/accounts/itau/statement?period=${period ?? ''}`,
      ),
    queryKey: ['data', 'finance', 'statement', 'itau', period],
  })
  const lines = data?.lines ?? []
  return (
    <Finance3
      error={isError}
      onPageChange={setPage}
      onPeriodChange={setPeriod}
      onRetry={() => refetch()}
      page={page}
      pageCount={Math.max(1, Math.ceil(lines.length / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      period={period}
      periods={periods}
      records={lines.slice((page - 1) * pageSize, page * pageSize)}
      summary={data?.summary}
      total={lines.length}
      variant="statement"
    />
  )
}

const ClientMoneyPage = () => {
  const [page, setPage] = useState(1)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<Finance3ClientMoneyPage>('/data/finance/client-money'),
    queryKey: ['data', 'finance', 'client-money'],
  })
  const items = data?.items ?? []
  return (
    <Finance3
      error={isError}
      onPageChange={setPage}
      onRetry={() => refetch()}
      page={page}
      pageCount={Math.max(1, Math.ceil(items.length / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      records={items.slice((page - 1) * pageSize, page * pageSize)}
      total={items.length}
      variant="clientMoney"
    />
  )
}

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Finance/Finance3/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Entries: Story = {
  beforeEach: ({ msw }) => {
    msw.use(
      finance3Handlers.entries.loaded,
      finance3Handlers.receivables.loaded,
    )
  },
  render: () => <LedgerPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Custas de distribuição'),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
  },
}

export const EntriesPending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance3Handlers.entries.pending)
  },
  render: () => <LedgerPage />,
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando lançamentos'),
    ).toBeVisible()
  },
}

export const EntriesFailed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance3Handlers.entries.error)
  },
  render: () => <LedgerPage />,
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível listar os lançamentos',
      ),
    ).toBeVisible()
  },
}

export const Receivables: Story = {
  beforeEach: ({ msw }) => {
    msw.use(
      finance3Handlers.entries.loaded,
      finance3Handlers.receivables.truncated,
    )
  },
  render: () => <LedgerPage initialView="collection" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Moinho Santa Clara Ltda.'),
    ).toBeVisible()
    await expect(
      canvas.getByText('Mostrando as 500 parcelas mais atrasadas.'),
    ).toBeVisible()
  },
}

export const Statement: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance3Handlers.statement.loaded)
  },
  render: () => <StatementPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Honorários de êxito · TransVale'),
    ).toBeVisible()
    await expect(canvas.getByText(/^Itaú PJ · /)).toBeVisible()
  },
}

export const ClientMoney: Story = {
  beforeEach: ({ msw }) => {
    msw.use(finance3Handlers.clientMoney.loaded)
  },
  render: () => <ClientMoneyPage />,
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Helena Prado'),
    ).toBeVisible()
  },
}
