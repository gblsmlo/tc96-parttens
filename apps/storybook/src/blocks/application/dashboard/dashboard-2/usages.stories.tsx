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
import { initialSort, sortOrders } from '../fixtures/dashboard-2.ts'

interface RetailData {
  channels: Dashboard2Channel[]
  kpis: Dashboard2Kpi[]
  orders: Dashboard2Order[]
  sales: Dashboard2SalesPoint[]
}

const RetailDashboard = () => {
  const [sort, setSort] = useState<Dashboard2Sort>(initialSort)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<RetailData>('/dashboard/retail-revenue'),
    queryKey: ['dashboard', 'retail-revenue'],
    retry: false,
  })

  return (
    <Dashboard2
      channels={data?.channels ?? []}
      error={isError}
      kpis={data?.kpis ?? []}
      onRetry={() => refetch()}
      onSortChange={setSort}
      orders={sortOrders(data?.orders ?? [], sort)}
      pending={isPending}
      sales={data?.sales ?? []}
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
