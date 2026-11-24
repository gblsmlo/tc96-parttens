import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard2,
  type Dashboard2Channel,
  type Dashboard2Kpi,
  type Dashboard2Order,
  type Dashboard2SalesPoint,
  type Dashboard2Sort,
} from '@tc96/blocks/application/dashboard/dashboard-2'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard2Handlers } from '../../../../mocks/dashboard-2.ts'
import {
  initialSort,
  orderActions,
  sortOrders,
} from '../fixtures/dashboard-2.ts'
import {
  breadcrumbsFor,
  initialPeriod,
  matchesSearch,
  paginate,
  periodOptions,
} from '../fixtures/shared.ts'

interface RetailData {
  channels: Dashboard2Channel[]
  kpis: Dashboard2Kpi[]
  orders: Dashboard2Order[]
  sales: Dashboard2SalesPoint[]
}

const RetailDashboard = () => {
  const [sort, setSort] = useState<Dashboard2Sort>(initialSort)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(initialPeriod)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<RetailData>(`/dashboard/retail-revenue?period=${period}`),
    queryKey: ['dashboard', 'retail-revenue', period],
    retry: false,
  })
  const visible = paginate(
    sortOrders(
      (data?.orders ?? []).filter((order) =>
        matchesSearch(search, order.number, order.customer),
      ),
      sort,
    ),
    page,
    4,
  )

  return (
    <Dashboard2
      breadcrumbs={breadcrumbsFor('Receita do varejo')}
      channels={data?.channels ?? []}
      error={isError}
      kpis={data?.kpis ?? []}
      onExport={() => undefined}
      onPageChange={setPage}
      onPeriodChange={setPeriod}
      onRetry={() => refetch()}
      onRowAction={() => undefined}
      onSearchChange={(next) => {
        setSearch(next)
        setPage(1)
      }}
      onSortChange={(next) => {
        setSort(next)
        setPage(1)
      }}
      orders={visible.rows}
      pagination={visible.pagination}
      pending={isPending}
      period={period}
      periodOptions={periodOptions}
      rowActions={orderActions}
      sales={data?.sales ?? []}
      search={search}
      sort={sort}
    />
  )
}

const meta = {
  component: RetailDashboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard2/Usages',
} satisfies Meta<typeof RetailDashboard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Helena Prado')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por Total' }),
    )
    const rows = canvas.getAllByRole('row')
    await expect(rows[1]).toHaveTextContent('Beatriz Sampaio')
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma venda registrada'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as vendas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText(
        'Carregando receita do varejo',
      ),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
