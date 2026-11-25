import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard6,
  type Dashboard6LossReason,
  type Dashboard6Stage,
  type Dashboard6Summary,
} from '@tc96/ui/blocks/application/dashboard/dashboard-6'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard6Handlers } from '../../../../mocks/dashboard-6.ts'
import { crmPeriodOptions, initialCrmPeriod } from '../fixtures/dashboard-6.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'

interface CrmSummaryData {
  lossReasons: Dashboard6LossReason[]
  stages: Dashboard6Stage[]
  summary: Dashboard6Summary | null
}

const CrmAnalytics = () => {
  const [period, setPeriod] = useState(initialCrmPeriod)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<CrmSummaryData>(`/dashboard/crm-summary?period=${period}`),
    queryKey: ['dashboard', 'crm-summary', period],
    retry: false,
  })

  return (
    <Dashboard6
      breadcrumbs={breadcrumbsFor('Analítico')}
      error={isError}
      lossReasons={data?.lossReasons ?? []}
      onPeriodChange={setPeriod}
      onRetry={() => refetch()}
      pending={isPending}
      period={period}
      periodOptions={crmPeriodOptions}
      stages={data?.stages ?? []}
      summary={data?.summary ?? undefined}
    />
  )
}

const meta = {
  component: CrmAnalytics,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Dashboard/Dashboard6/Usages',
} satisfies Meta<typeof CrmAnalytics>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard6Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('table', { name: 'Leads em aberto por etapa' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Qualificação' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard6Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum lead no funil'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard6Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar o resumo do funil'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard6Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText(
        'Carregando o resumo do funil',
      ),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
