import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard1,
  type Dashboard1CapacityPoint,
  type Dashboard1Exception,
  type Dashboard1Kpi,
} from '@tc96/blocks/application/dashboard/dashboard-1'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard1Handlers } from '../../../../mocks/dashboard-1.ts'
import { filterExceptions, filterOptions } from '../fixtures/dashboard-1.ts'

interface FulfillmentData {
  capacity: Dashboard1CapacityPoint[]
  exceptions: Dashboard1Exception[]
  kpis: Dashboard1Kpi[]
}

const FulfillmentDashboard = () => {
  const [filter, setFilter] = useState('all')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<FulfillmentData>('/dashboard/fulfillment'),
    queryKey: ['dashboard', 'fulfillment'],
    retry: false,
  })

  return (
    <Dashboard1
      capacity={data?.capacity ?? []}
      error={isError}
      exceptions={filterExceptions(data?.exceptions ?? [], filter)}
      filter={filter}
      filterOptions={filterOptions}
      kpis={data?.kpis ?? []}
      onFilterChange={setFilter}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: FulfillmentDashboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
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
    await userEvent.click(canvas.getByRole('button', { name: 'Escaladas' }))
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
