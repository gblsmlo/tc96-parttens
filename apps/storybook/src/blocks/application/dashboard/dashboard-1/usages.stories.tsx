import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard1,
  type Dashboard1CapacityPoint,
  type Dashboard1Exception,
  type Dashboard1Kpi,
  type Dashboard1ReasonSlice,
} from '@tc96/blocks/application/dashboard/dashboard-1'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard1Handlers } from '../../../../mocks/dashboard-1.ts'
import {
  countFilterOptions,
  filterExceptions,
} from '../fixtures/dashboard-1.ts'
import {
  breadcrumbsFor,
  initialPeriod,
  matchesSearch,
  paginate,
  periodOptions,
  rowActions,
} from '../fixtures/shared.ts'

interface FulfillmentData {
  capacity: Dashboard1CapacityPoint[]
  exceptions: Dashboard1Exception[]
  kpis: Dashboard1Kpi[]
  reasons: Dashboard1ReasonSlice[]
}

const FulfillmentDashboard = () => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(initialPeriod)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<FulfillmentData>(`/dashboard/fulfillment?period=${period}`),
    queryKey: ['dashboard', 'fulfillment', period],
    retry: false,
  })
  const searched = (data?.exceptions ?? []).filter((row) =>
    matchesSearch(search, row.order, row.hub, row.reason),
  )
  const visible = paginate(filterExceptions(searched, filter), page, 4)

  return (
    <Dashboard1
      breadcrumbs={breadcrumbsFor('Exceções de expedição')}
      capacity={data?.capacity ?? []}
      error={isError}
      exceptions={visible.rows}
      filter={filter}
      filterOptions={countFilterOptions(searched)}
      kpis={data?.kpis ?? []}
      onExport={() => undefined}
      onFilterChange={(next) => {
        setFilter(next)
        setPage(1)
      }}
      onPageChange={setPage}
      onPeriodChange={setPeriod}
      onRetry={() => refetch()}
      onRowAction={() => undefined}
      onSearchChange={(next) => {
        setSearch(next)
        setPage(1)
      }}
      pagination={visible.pagination}
      pending={isPending}
      period={period}
      periodOptions={periodOptions}
      reasons={data?.reasons ?? []}
      rowActions={rowActions}
      search={search}
    />
  )
}

const meta = {
  component: FulfillmentDashboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Dashboard/Dashboard1/Usages',
} satisfies Meta<typeof FulfillmentDashboard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('PED-48213')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Escaladas 2' }))
    await expect(canvas.getByText('PED-48177')).toBeVisible()
    await expect(canvas.queryByText('PED-48213')).toBeNull()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma exceção de expedição'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as exceções'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText(
        'Carregando exceções de expedição',
      ),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
