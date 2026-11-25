import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard3,
  type Dashboard3ForecastPoint,
  type Dashboard3Kpi,
  type Dashboard3Member,
  type Dashboard3QueueItem,
} from '@tc96/ui/blocks/application/dashboard/dashboard-3'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard3Handlers } from '../../../../mocks/dashboard-3.ts'
import {
  breadcrumbsFor,
  initialPeriod,
  matchesSearch,
  paginate,
  periodOptions,
} from '../fixtures/shared.ts'

interface CoverageData {
  crew: Dashboard3Member[]
  forecast: Dashboard3ForecastPoint[]
  kpis: Dashboard3Kpi[]
  queue: Dashboard3QueueItem[]
}

const CoverageDashboard = () => {
  const [done, setDone] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(initialPeriod)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<CoverageData>(`/dashboard/team-coverage?period=${period}`),
    queryKey: ['dashboard', 'team-coverage', period],
    retry: false,
  })
  const visible = paginate(
    (data?.crew ?? []).filter((member) =>
      matchesSearch(search, member.name, member.role),
    ),
    page,
    3,
  )

  return (
    <Dashboard3
      breadcrumbs={breadcrumbsFor('Cobertura das equipes')}
      crew={visible.rows}
      error={isError}
      forecast={data?.forecast ?? []}
      kpis={data?.kpis ?? []}
      onAction={(id) => setDone((current) => [...current, id])}
      onExport={() => undefined}
      onPageChange={setPage}
      onPeriodChange={setPeriod}
      onRetry={() => refetch()}
      onSearchChange={(next) => {
        setSearch(next)
        setPage(1)
      }}
      pagination={visible.pagination}
      pending={isPending}
      period={period}
      periodOptions={periodOptions}
      search={search}
      queue={(data?.queue ?? []).filter((item) => !done.includes(item.id))}
    />
  )
}

const meta = {
  component: CoverageDashboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Dashboard/Dashboard3/Usages',
} satisfies Meta<typeof CoverageDashboard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard3Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard3Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard3Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard3Handlers.pending)
  },
}
