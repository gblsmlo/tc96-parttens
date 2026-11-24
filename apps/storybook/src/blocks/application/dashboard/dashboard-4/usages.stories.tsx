import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Dashboard4,
  type Dashboard4Metric,
  type Dashboard4Person,
  type Dashboard4Sort,
} from '@tc96/blocks/application/dashboard/dashboard-4'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dashboard4Handlers } from '../../../../mocks/dashboard-4.ts'
import {
  filterModules,
  filterOptionsFor,
  initialFilter,
  initialSort,
  type ModuleRecord,
  moduleActions,
  pageModules,
  sortModules,
} from '../fixtures/dashboard-4.ts'
import { matchesSearch } from '../fixtures/shared.ts'
import { dashboard4Breadcrumbs } from './dashboard-4-layouts.tsx'

interface ModuleTrackerData {
  metrics: Dashboard4Metric[]
  modules: ModuleRecord[]
  team: Dashboard4Person[]
}

const ModuleTracker = () => {
  const [sort, setSort] = useState<Dashboard4Sort>(initialSort)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(initialFilter)
  const [page, setPage] = useState(1)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<ModuleTrackerData>('/dashboard/module-tracker'),
    queryKey: ['dashboard', 'module-tracker'],
    retry: false,
  })
  const searched = (data?.modules ?? []).filter((row) =>
    matchesSearch(search, row.name, row.owner.label, row.domain),
  )
  const visible = pageModules(
    sortModules(filterModules(searched, filter), sort),
    page,
    10,
  )

  return (
    <Dashboard4
      breadcrumbs={dashboard4Breadcrumbs}
      error={isError}
      filter={filter}
      filterOptions={filterOptionsFor(searched)}
      metrics={data?.metrics ?? []}
      modules={visible.rows}
      onAddModule={() => undefined}
      onFavoriteChange={() => undefined}
      onFilterChange={(next) => {
        setFilter(next)
        setPage(1)
      }}
      onInvite={() => undefined}
      onOpen={() => undefined}
      onPageChange={setPage}
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
      pagination={visible.pagination}
      pending={isPending}
      rowActions={moduleActions}
      search={search}
      sort={sort}
      team={data?.team}
    />
  )
}

const meta = {
  component: ModuleTracker,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Dashboard/Dashboard4/Usages',
} satisfies Meta<typeof ModuleTracker>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Console de API')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por Progresso' }),
    )
    await expect(canvas.getAllByRole('row')[1]).toHaveTextContent('0% pronto')
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard4Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum módulo ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os módulos',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dashboard4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando módulos'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
