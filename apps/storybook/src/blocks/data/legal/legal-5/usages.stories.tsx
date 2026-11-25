import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Legal5,
  type Legal5Mode,
  type Legal5Record,
  type Legal5View,
} from '@tc96/ui/blocks/data/legal/legal-5'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal5Handlers } from '../../../../mocks/legal-5.ts'
import {
  clients,
  type Legal5Page,
  type Legal5SavedViewConfig,
  owners,
  pageSize,
  phases,
  tags,
} from '../fixtures/legal-5.ts'
import { useSavedViewsQuery } from '../legal-saved-views.ts'

const LawFirmRecords = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Legal5Mode>('table')
  const [view, setView] = useState<Legal5View>('all')
  const [search, setSearch] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [phaseFilter, setPhaseFilter] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const views = useSavedViewsQuery<Legal5SavedViewConfig>('legal-records', {
    apply: (config) => {
      setView(config.view)
      setOwnerFilter(config.ownerFilter)
      setPhaseFilter(config.phaseFilter)
      setPage(1)
    },
    config: { ownerFilter, phaseFilter, view },
  })

  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(page),
    view,
  })
  if (search) params.set('q', search)
  if (ownerFilter) params.set('ownerId', ownerFilter)
  for (const phaseId of phaseFilter) params.append('phaseId', phaseId)
  const queryKey = ['data', 'legal', 'legal-records', params.toString()]

  const { data, isError, isPending, refetch } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Legal5Page>(`/data/legal/legal-records?${params.toString()}`),
    queryKey,
  })
  const update = (ids: readonly string[], change: Partial<Legal5Record>) =>
    queryClient.setQueryData<Legal5Page>(queryKey, (current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              ids.includes(item.id) ? { ...item, ...change } : item,
            ),
          }
        : current,
    )
  const firstPage = () => setPage(1)

  return (
    <Legal5
      {...views.props}
      clients={clients}
      counts={data?.counts}
      error={isError}
      filtered={Boolean(search || ownerFilter || phaseFilter.length)}
      mode={mode}
      onBulkOwnerChange={(ids, ownerId) => update(ids, { ownerId })}
      onBulkPhaseChange={(ids, phaseId) => update(ids, { phaseId })}
      onModeChange={setMode}
      onOwnerChange={(id, ownerId) => update([id], { ownerId })}
      onOwnerFilterChange={(next) => {
        setOwnerFilter(next)
        firstPage()
      }}
      onPageChange={setPage}
      onPhaseChange={(id, phaseId) => update([id], { phaseId })}
      onPhaseFilterChange={(next) => {
        setPhaseFilter(next)
        firstPage()
      }}
      onRetry={() => refetch()}
      onSearchChange={(next) => {
        setSearch(next)
        firstPage()
      }}
      onSelectedIdsChange={setSelectedIds}
      onTagsChange={(id, tagIds) => update([id], { tagIds })}
      onUnarchive={(id) => update([id], { archived: false })}
      onViewChange={(next) => {
        setView(next)
        firstPage()
        views.clear()
      }}
      ownerFilter={ownerFilter}
      owners={owners}
      page={page}
      pageCount={Math.max(1, Math.ceil((data?.total ?? 0) / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      phaseFilter={phaseFilter}
      phases={phases}
      records={data?.items ?? []}
      search={search}
      selectedIds={selectedIds}
      tags={tags}
      total={data?.total}
      view={view}
    />
  )
}

const meta = {
  component: LawFirmRecords,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal5/Usages',
} satisfies Meta<typeof LawFirmRecords>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal5Handlers.loaded, ...legal5Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Reclamação trabalhista de ex-motorista'),
    ).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.getByText('1–12 de 12')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal5Handlers.empty, ...legal5Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum processo ainda.'),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal5Handlers.pending, ...legal5Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando processos'),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal5Handlers.error, ...legal5Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os processos',
      ),
    ).toBeVisible()
  },
}

export const SavedViews: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal5Handlers.loaded, ...legal5Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Reclamação trabalhista de ex-motorista')
    await userEvent.click(canvas.getByRole('button', { name: 'Todos' }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Processos da Beatriz' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      await canvas.findByText('Ação de cobrança contra fornecedor de farinha'),
    ).toBeVisible()
    await waitFor(() =>
      expect(
        canvas.queryByText('Reclamação trabalhista de ex-motorista'),
      ).toBeNull(),
    )
    await expect(
      canvas.getByRole('button', { name: 'Processos da Beatriz' }),
    ).toBeVisible()
  },
}
