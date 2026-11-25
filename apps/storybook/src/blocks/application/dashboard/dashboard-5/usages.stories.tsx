import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard5,
  type Dashboard5Appointment,
  type Dashboard5Deadline,
  type Dashboard5DueDay,
  type Dashboard5Metrics,
  type Dashboard5Publication,
  type Dashboard5Queue,
} from '@tc96/ui/blocks/application/dashboard/dashboard-5'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard5Handlers } from '../../../../mocks/dashboard-5.ts'
import { dashboard5TimeZone, links } from '../fixtures/dashboard-5.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'

interface PendingData {
  appointments: Dashboard5Appointment[]
  deadlines: Dashboard5Deadline[]
  dueDays: Dashboard5DueDay[]
  metrics: Dashboard5Metrics
  publications: Dashboard5Publication[]
  queues: Dashboard5Queue[]
}

const PendingDashboard = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<PendingData>('/dashboard/legal-pending'),
    queryKey: ['dashboard', 'legal-pending'],
    retry: false,
  })

  return (
    <Dashboard5
      appointments={data?.appointments ?? []}
      breadcrumbs={breadcrumbsFor('Pendências')}
      deadlines={data?.deadlines ?? []}
      dueDays={data?.dueDays ?? []}
      error={isError}
      links={links}
      metrics={data?.metrics ?? {}}
      onRetry={() => refetch()}
      pending={isPending}
      publications={data?.publications ?? []}
      queues={data?.queues ?? []}
      timeZone={dashboard5TimeZone}
    />
  )
}

const meta = {
  component: PendingDashboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Dashboard/Dashboard5/Usages',
} satisfies Meta<typeof PendingDashboard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard5Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Contestação')).toBeVisible()
    await expect(
      await canvas.findByRole('img', { name: 'Prazos em cada fila' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard5Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma pendência'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard5Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar.'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard5Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando pendências'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
