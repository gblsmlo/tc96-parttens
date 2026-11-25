import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Crm2,
  type Crm2Archived,
  type Crm2GroupBy,
  type Crm2Lead,
  type Crm2Mode,
} from '@tc96/ui/blocks/data/crm/crm-2'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { crm2Handlers } from '../../../../mocks/crm-2.ts'
import {
  type Crm2Board,
  type Crm2Page,
  owners,
  pageSize,
  stages,
  tags,
} from '../fixtures/crm-2.ts'

const SalesFunnel = ({ initialMode }: Readonly<{ initialMode: Crm2Mode }>) => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Crm2Mode>(initialMode)
  const [groupBy, setGroupBy] = useState<Crm2GroupBy>('stage')
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [archivedFilter, setArchivedFilter] = useState<Crm2Archived | null>(
    null,
  )
  const [page, setPage] = useState(1)
  const isBoard = mode === 'kanban'

  const filters = new URLSearchParams()
  if (search) filters.set('q', search)
  if (stageFilter) filters.set('stageId', stageFilter)
  if (ownerFilter) filters.set('ownerId', ownerFilter)
  const pageParams = new URLSearchParams(filters)
  pageParams.set('limit', String(pageSize))
  pageParams.set('page', String(page))
  if (archivedFilter) pageParams.set('archived', archivedFilter)

  const boardKey = ['data', 'crm', 'leads-board', filters.toString()]
  const pageKey = ['data', 'crm', 'leads-page', pageParams.toString()]
  const boardQuery = useQuery({
    enabled: isBoard,
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Crm2Board>(`/data/crm/leads/board?${filters.toString()}`),
    queryKey: boardKey,
  })
  const pageQuery = useQuery({
    enabled: !isBoard,
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Crm2Page>(`/data/crm/leads?${pageParams.toString()}`),
    queryKey: pageKey,
  })
  const active = isBoard ? boardQuery : pageQuery

  const moveStage = (ids: readonly string[], stageId: string) => {
    const move = (items: Crm2Lead[]) =>
      items.map((item) => (ids.includes(item.id) ? { ...item, stageId } : item))
    queryClient.setQueryData<Crm2Board>(boardKey, (current) =>
      current ? { ...current, leads: move(current.leads) } : current,
    )
    queryClient.setQueryData<Crm2Page>(pageKey, (current) =>
      current ? { ...current, items: move(current.items) } : current,
    )
  }
  const firstPage = () => setPage(1)

  return (
    <Crm2
      archivedFilter={archivedFilter}
      boardHasMore={boardQuery.data?.hasMore}
      error={active.isError}
      filtered={Boolean(search || stageFilter || ownerFilter)}
      groupBy={groupBy}
      leads={(isBoard ? boardQuery.data?.leads : pageQuery.data?.items) ?? []}
      mode={mode}
      onArchivedFilterChange={(next) => {
        setArchivedFilter(next)
        firstPage()
      }}
      onBulkStageChange={moveStage}
      onGroupByChange={setGroupBy}
      onModeChange={setMode}
      onOwnerFilterChange={(next) => {
        setOwnerFilter(next)
        firstPage()
      }}
      onPageChange={setPage}
      onRetry={() => active.refetch()}
      onSearchChange={(next) => {
        setSearch(next)
        firstPage()
      }}
      onStageChange={(id, stageId) => moveStage([id], stageId)}
      onStageFilterChange={(next) => {
        setStageFilter(next)
        firstPage()
      }}
      ownerFilter={ownerFilter}
      owners={owners}
      page={page}
      pageCount={Math.max(
        1,
        Math.ceil((pageQuery.data?.total ?? 0) / pageSize),
      )}
      pageSize={pageSize}
      pending={active.isPending}
      search={search}
      stageFilter={stageFilter}
      stageValues={boardQuery.data?.stageValues}
      stages={stages}
      tags={tags}
      total={pageQuery.data?.total}
    />
  )
}

const meta = {
  args: { initialMode: 'kanban' },
  component: SalesFunnel,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/CRM/Crm2/Usages',
} satisfies Meta<typeof SalesFunnel>

export default meta

type Story = StoryObj<typeof meta>

export const SalesBoard: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...crm2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const negotiation = within(
      await within(canvasElement).findByRole('region', {
        name: /^Negociação/,
      }),
    )
    await expect(
      await negotiation.findByText('Piloto de BI para a Rede Farmavida'),
    ).toBeVisible()
  },
}

export const LeadsTable: Story = {
  args: { initialMode: 'table' },
  beforeEach: ({ msw }) => {
    msw.use(...crm2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Implantação de ERP na Padaria Pão Dourado'),
    ).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(canvas.getByText('1–5 de 11')).toBeVisible()
  },
}

export const Empty: Story = {
  args: { initialMode: 'table' },
  beforeEach: ({ msw }) => {
    msw.use(...crm2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum lead ainda.'),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...crm2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando leads'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...crm2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível listar os leads',
      ),
    ).toBeVisible()
  },
}
