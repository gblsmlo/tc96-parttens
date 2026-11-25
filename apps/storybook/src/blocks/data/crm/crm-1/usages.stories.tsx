import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Crm1,
  type Crm1Archived,
  type Crm1Company,
  type Crm1Contact,
  type Crm1Mode,
  type Crm1PeopleProps,
  type Crm1Person,
  type Crm1Sort,
  type Crm1Variant,
} from '@tc96/ui/blocks/data/crm/crm-1'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { crm1Handlers } from '../../../../mocks/crm-1.ts'
import {
  type Crm1Page,
  pageSize,
  savedViews,
  sectors,
  tags,
} from '../fixtures/crm-1.ts'

const ContactsScreen = ({
  initialVariant,
}: Readonly<{ initialVariant: Crm1Variant }>) => {
  const queryClient = useQueryClient()
  const [variant, setVariant] = useState<Crm1Variant>(initialVariant)
  const [mode, setMode] = useState<Crm1Mode>('table')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Crm1Sort>('name_asc')
  const [archivedFilter, setArchivedFilter] = useState<Crm1Archived | null>(
    null,
  )
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [savedViewId, setSavedViewId] = useState<string | null>(null)

  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(page),
    sort,
    variant,
  })
  if (search) params.set('q', search)
  if (archivedFilter) params.set('archived', archivedFilter)
  for (const tagId of tagFilter) params.append('tagId', tagId)
  const url = `/data/crm/contacts?${params.toString()}`
  const queryKey = ['data', 'crm', 'contacts', params.toString()]

  const peopleQuery = useQuery({
    enabled: variant === 'people',
    placeholderData: keepPreviousData,
    queryFn: () => fetchJson<Crm1Page<Crm1Person>>(url),
    queryKey,
  })
  const companiesQuery = useQuery({
    enabled: variant === 'companies',
    placeholderData: keepPreviousData,
    queryFn: () => fetchJson<Crm1Page<Crm1Company>>(url),
    queryKey,
  })
  const active = variant === 'people' ? peopleQuery : companiesQuery

  const update = (ids: readonly string[], change: Partial<Crm1Company>) =>
    queryClient.setQueryData<Crm1Page<Crm1Contact>>(queryKey, (current) =>
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

  const shared: Omit<Crm1PeopleProps, 'records' | 'variant'> = {
    archivedFilter,
    counts: active.data?.counts,
    error: active.isError,
    filtered: Boolean(
      search || tagFilter.length || (archivedFilter ?? 'exclude') !== 'exclude',
    ),
    mode,
    onArchivedFilterChange: (next) => {
      setArchivedFilter(next)
      firstPage()
    },
    onBulkArchive: (ids) => update(ids, { archived: true }),
    onBulkUnarchive: (ids) => update(ids, { archived: false }),
    onModeChange: setMode,
    onPageChange: setPage,
    onRetry: () => active.refetch(),
    onSavedViewSelect: setSavedViewId,
    onSearchChange: (next) => {
      setSearch(next)
      firstPage()
    },
    onSelectedIdsChange: setSelectedIds,
    onSortChange: (next) => {
      setSort(next)
      firstPage()
    },
    onTagFilterChange: (next) => {
      setTagFilter(next)
      firstPage()
    },
    onVariantChange: (next) => {
      setVariant(next)
      setSavedViewId(null)
      firstPage()
    },
    page,
    pageCount: Math.max(1, Math.ceil((active.data?.total ?? 0) / pageSize)),
    pageSize,
    pending: active.isPending,
    savedViewId,
    savedViews,
    search,
    selectedIds,
    sort,
    tagFilter,
    tags,
    total: active.data?.total,
  }

  return variant === 'people' ? (
    <Crm1
      {...shared}
      records={peopleQuery.data?.items ?? []}
      variant="people"
    />
  ) : (
    <Crm1
      {...shared}
      onBulkSectorChange={(ids, sectorId) => update(ids, { sectorId })}
      records={companiesQuery.data?.items ?? []}
      sectors={sectors}
      variant="companies"
    />
  )
}

const meta = {
  args: { initialVariant: 'people' },
  component: ContactsScreen,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/CRM/Crm1/Usages',
} satisfies Meta<typeof ContactsScreen>

export default meta

type Story = StoryObj<typeof meta>

export const People: Story = {
  beforeEach: ({ msw }) => {
    msw.use(crm1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Helena Prado')).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: 'CPF' }),
    ).toBeVisible()
    await expect(canvas.getByText('1–10 de 10')).toBeVisible()
  },
}

export const Companies: Story = {
  args: { initialVariant: 'companies' },
  beforeEach: ({ msw }) => {
    msw.use(crm1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Moinho Santa Clara Ltda.'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: 'Setor' }),
    ).toBeVisible()
    await expect(canvas.getByText('1–10 de 10')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(crm1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma pessoa cadastrada.'),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(crm1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando pessoas'),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Pessoas' })).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(crm1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível listar as pessoas',
      ),
    ).toBeVisible()
  },
}
