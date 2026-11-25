import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Support1,
  type Support1Sort,
  type Support1Ticket,
} from '@tc96/ui/blocks/data/support/support-1'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { support1Handlers } from '../../../../mocks/support-1.ts'
import { initialSort, owners } from '../fixtures/support-1.ts'

const SupportQueue = () => {
  const [sort, setSort] = useState<Support1Sort | null>(initialSort)
  const [pageSize, setPageSize] = useState(6)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Support1Ticket[]>('/data/tickets'),
    queryKey: ['data', 'tickets'],
  })

  return (
    <Support1
      error={isError}
      onPageSizeChange={setPageSize}
      onRetry={() => refetch()}
      onSortChange={setSort}
      owners={owners}
      pageSize={pageSize}
      pageSizeOptions={[6, 12, 24]}
      pending={isPending}
      sort={sort}
      tickets={data ?? []}
    />
  )
}

const meta = {
  component: SupportQueue,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Support/Support1/Usages',
} satisfies Meta<typeof SupportQueue>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support1Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support1Handlers.pending)
  },
}
