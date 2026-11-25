import type { Meta, StoryObj } from '@storybook/react-vite'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  Legal7,
  type Legal7LawsuitFilter,
  type Legal7Mode,
  type Legal7Sort,
} from '@tc96/ui/blocks/data/legal/legal-7'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal7Handlers } from '../../../../mocks/legal-7.ts'
import {
  type Legal7SavedViewConfig,
  type PublicationQueuePage,
  pageSize,
} from '../fixtures/legal-7.ts'
import { useSavedViewsQuery } from '../legal-saved-views.ts'

const PublicationsQueue = ({ withSavedViews = false }) => {
  const [mode, setMode] = useState<Legal7Mode>('table')
  const [sort, setSort] = useState<Legal7Sort>('oldest')
  const [lawsuit, setLawsuit] = useState<Legal7LawsuitFilter | null>(null)
  const [tribunal, setTribunal] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data, isError, isPending, refetch } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), sort })
      if (lawsuit) params.set('lawsuit', lawsuit)
      if (tribunal) params.set('tribunal', tribunal)
      return fetchJson<PublicationQueuePage>(
        `/data/legal/publications?${params}`,
      )
    },
    queryKey: [
      'data',
      'legal',
      'publications',
      { lawsuit, page, sort, tribunal },
    ],
  })
  const restart = () => {
    setPage(1)
    setSelectedIds([])
  }
  const views = useSavedViewsQuery<Legal7SavedViewConfig>(
    'publications',
    {
      apply: (config) => {
        setLawsuit(config.lawsuit)
        setSort(config.sort)
        setTribunal(config.tribunal)
        restart()
      },
      config: { lawsuit, sort, tribunal },
      reset: () => {
        setLawsuit(null)
        setSort('oldest')
        setTribunal(null)
        restart()
      },
    },
    withSavedViews,
  )

  return (
    <Legal7
      {...(withSavedViews ? views.props : {})}
      error={isError}
      lawsuitFilter={lawsuit}
      mode={mode}
      onDiscard={() => setSelectedIds([])}
      onLawsuitFilterChange={(next) => {
        setLawsuit(next)
        restart()
      }}
      onLinkLawsuit={() => setSelectedIds([])}
      onModeChange={setMode}
      onPageChange={(next) => {
        setPage(next)
        setSelectedIds([])
      }}
      onRetry={() => refetch()}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={(next) => {
        setSort(next)
        restart()
      }}
      onTribunalFilterChange={(next) => {
        setTribunal(next)
        restart()
      }}
      page={page}
      pageCount={Math.max(1, Math.ceil((data?.total ?? 0) / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      publications={data?.items ?? []}
      selectedIds={selectedIds}
      sort={sort}
      total={data?.total ?? 0}
      tribunalFilter={tribunal}
      tribunals={data?.tribunals ?? []}
    />
  )
}

const meta = {
  component: PublicationsQueue,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal7/Usages',
} satisfies Meta<typeof PublicationsQueue>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal7Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Citação')).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
  },
}

export const TheServerPagesTheQueue: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal7Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Citação')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await waitFor(() => expect(canvas.getByText('6–10 de 12')).toBeVisible())
    await expect(await canvas.findByText('Edital')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal7Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText(
        'Nenhuma publicação para decidir. As novas chegam na próxima captura.',
      ),
    ).toBeVisible()
    await expect(canvas.queryByRole('navigation')).toBeNull()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal7Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando publicações'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Publicações' }),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal7Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as publicações',
      ),
    ).toBeVisible()
  },
}

export const SavedViews: Story = {
  args: { withSavedViews: true },
  beforeEach: ({ msw }) => {
    msw.use(legal7Handlers.loaded, ...legal7Handlers.savedViews())
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('1–5 de 12')).toBeVisible()
    await expect(canvas.queryByRole('heading', { level: 2 })).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Todas' }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'TRT-15 mais novas' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(canvas.getByText('1–2 de 2')).toBeVisible())
    await expect(
      canvas.getByRole('button', { name: 'TRT-15 mais novas' }),
    ).toBeVisible()
  },
}
