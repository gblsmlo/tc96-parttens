import type { Meta, StoryObj } from '@storybook/react-vite'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import {
  Inbox1,
  type Inbox1Category,
  type Inbox1Kind,
  type Inbox1ReadFilter,
  type Inbox1ReceivedFilter,
  type Inbox1Sort,
} from '@tc96/ui/blocks/data/inbox/inbox-1'
import { useState } from 'react'
import { apiUrl, fetchJson } from '../../../../mocks/api.ts'
import { inbox1Handlers } from '../../../../mocks/inbox-1.ts'
import {
  type Inbox1Page,
  originColors,
  pageSize,
  withReadState,
} from '../fixtures/inbox-1.ts'

interface InboxQuery {
  category: Inbox1Category | null
  kind: Inbox1Kind | null
  read: Inbox1ReadFilter | null
  received: Inbox1ReceivedFilter | null
  sort: Inbox1Sort
}

const pathOf = (query: InboxQuery, cursor: number) => {
  const params = new URLSearchParams()
  for (const [name, value] of Object.entries(query))
    if (value && value !== 'newest') params.set(name, value)
  if (cursor > 0) params.set('cursor', String(cursor))
  return `/data/inbox/entries?${params}`
}

const sendMarks = async ({ ids, read }: { ids: string[]; read: boolean }) => {
  const response = await fetch(apiUrl('/data/inbox/marks'), {
    body: JSON.stringify({ ids, read }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (!response.ok) throw new Error(String(response.status))
}

const InboxScreen = () => {
  const [query, setQuery] = useState<InboxQuery>({
    category: null,
    kind: null,
    read: null,
    received: null,
    sort: 'newest',
  })
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [marks, setMarks] = useState<ReadonlyMap<string, boolean>>(new Map())
  const inbox = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchJson<Inbox1Page>(pathOf(query, (page - 1) * pageSize)),
    queryKey: ['data', 'inbox', 'entries', query, page],
    retry: false,
  })
  const marking = useMutation({
    mutationFn: sendMarks,
    onError: (_, { ids, read }) =>
      setMarks(
        (current) =>
          new Map([...current, ...ids.map((id) => [id, !read] as const)]),
      ),
  })
  const mark = (ids: string[], read: boolean) => {
    setMarks(
      (current) =>
        new Map([...current, ...ids.map((id) => [id, read] as const)]),
    )
    marking.mutate({ ids, read })
  }
  const change = (next: Partial<InboxQuery>) => {
    setQuery((current) => ({ ...current, ...next }))
    setPage(1)
    setSelectedIds([])
  }
  const total = inbox.data?.total ?? 0

  return (
    <Inbox1
      category={query.category}
      entries={withReadState(inbox.data?.items ?? [], marks)}
      error={inbox.isError}
      kindFilter={query.kind}
      markError={marking.isError}
      onCategoryChange={(category) => change({ category })}
      onKindFilterChange={(kind) => change({ kind })}
      onMarkRead={(ids) => mark(ids, true)}
      onOpen={(id) => mark([id], true)}
      onPageChange={(next) => {
        setPage(next)
        setSelectedIds([])
      }}
      onReadChange={(id, read) => mark([id], read)}
      onReadFilterChange={(read) => change({ read })}
      onReceivedFilterChange={(received) => change({ received })}
      onRetry={() => inbox.refetch()}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={(sort) => change({ sort })}
      originColors={originColors}
      page={page}
      pageCount={Math.ceil(total / pageSize)}
      pageSize={pageSize}
      pending={inbox.isPending}
      readFilter={query.read}
      receivedFilter={query.received}
      selectedIds={selectedIds}
      sort={query.sort}
      total={total}
    />
  )
}

const meta = {
  component: InboxScreen,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Inbox/Inbox1/Usages',
} satisfies Meta<typeof InboxScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...inbox1Handlers.loaded)
  },
}

export const MarkingReadFailed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...inbox1Handlers.markFailed)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...inbox1Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...inbox1Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(...inbox1Handlers.error)
  },
}
