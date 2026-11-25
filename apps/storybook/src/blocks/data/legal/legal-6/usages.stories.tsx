import type { Meta, StoryObj } from '@storybook/react-vite'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import {
  Legal6,
  type Legal6Sort,
  type Legal6View,
} from '@tc96/ui/blocks/data/legal/legal-6'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal6Handlers } from '../../../../mocks/legal-6.ts'
import {
  kinds,
  type Legal6QueuePage,
  type Legal6SavedViewConfig,
  owners,
} from '../fixtures/legal-6.ts'
import { useSavedViewsQuery } from '../legal-saved-views.ts'

const pathOf = (filters: Record<string, string | null>, cursor: number) => {
  const params = new URLSearchParams()
  for (const [name, value] of Object.entries(filters))
    if (value) params.set(name, value)
  if (cursor > 0) params.set('cursor', String(cursor))
  return `/data/legal/deadline-queue?${params}`
}

const DeadlineQueues = ({ initialView = 'mine' as Legal6View }) => {
  const queryClient = useQueryClient()
  const [view, setView] = useState<Legal6View>(initialView)
  const [sort, setSort] = useState<Legal6Sort>('fatal')
  const [owner, setOwner] = useState<string | null>(null)
  const [kind, setKind] = useState<string | null>(null)
  const views = useSavedViewsQuery<Legal6SavedViewConfig>('deadline-queue', {
    apply: (config) => {
      setView(config.view)
      setSort(config.sort)
      setOwner(config.ownerFilter)
      setKind(config.kindFilter)
    },
    config: { kindFilter: kind, ownerFilter: owner, sort, view },
  })
  const queryKey = ['data', 'legal', 'deadline-queue', view, sort, owner, kind]
  const queue = useInfiniteQuery({
    getNextPageParam: (page: Legal6QueuePage) => page.nextCursor,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchJson<Legal6QueuePage>(
        pathOf({ kind, owner, sort, view }, pageParam),
      ),
    queryKey,
    retry: false,
  })
  const pages = queue.data?.pages ?? []
  const decide = () => queryClient.invalidateQueries({ queryKey })

  return (
    <Legal6
      {...views.props}
      counts={pages[0]?.counts}
      deadlines={pages.flatMap((page) => page.items)}
      error={queue.isError && pages.length === 0}
      hasMore={queue.hasNextPage}
      kindFilter={kind}
      kinds={kinds}
      loadingMore={queue.isFetchingNextPage}
      loadMoreError={queue.isFetchNextPageError}
      onConfirm={decide}
      onKindFilterChange={setKind}
      onLoadMore={() => queue.fetchNextPage()}
      onOwnerFilterChange={setOwner}
      onReject={decide}
      onRetry={() => queue.refetch()}
      onSortChange={setSort}
      onViewChange={(next) => {
        setView(next)
        views.clear()
      }}
      ownerFilter={owner}
      owners={owners}
      pending={queue.isPending}
      sort={sort}
      view={view}
    />
  )
}

const meta = {
  component: DeadlineQueues,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal6/Usages',
} satisfies Meta<typeof DeadlineQueues>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal6Handlers.loaded, ...legal6Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Réplica à contestação')).toBeVisible()
    await expect(
      canvas.getByRole('table', { name: 'Prazos: Minha fila' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Minha fila' }),
    ).toBeVisible()
  },
}

export const LoadsMoreByCursor: Story = {
  args: { initialView: 'all' },
  beforeEach: ({ msw }) => {
    msw.use(legal6Handlers.loaded, ...legal6Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Carregar mais' }),
    )
    await expect(await canvas.findByText('Apelação')).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(8)
    await expect(
      canvas.queryByRole('button', { name: 'Carregar mais' }),
    ).toBeNull()
  },
}

export const LoadMoreFailed: Story = {
  args: { initialView: 'all' },
  beforeEach: ({ msw }) => {
    msw.use(legal6Handlers.moreFailed, ...legal6Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Carregar mais' }),
    )
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar mais prazos. Tente de novo.',
    )
    await expect(rowsOf(canvasElement)).toHaveLength(5)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal6Handlers.empty, ...legal6Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum prazo na sua fila.'),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal6Handlers.pending, ...legal6Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando prazos'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal6Handlers.error, ...legal6Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os prazos',
      ),
    ).toBeVisible()
  },
}

export const SavedViews: Story = {
  args: { initialView: 'all' },
  beforeEach: ({ msw }) => {
    msw.use(legal6Handlers.loaded, ...legal6Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Réplica à contestação')
    await userEvent.click(canvas.getByRole('button', { name: 'Todos' }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Prazos do Rafael' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      canvas.getByRole('button', { name: 'Prazos do Rafael' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Exibição (1)' }),
    ).toBeVisible()
  },
}
