import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Legal4,
  type Legal4Client,
  type Legal4Mode,
} from '@tc96/ui/blocks/data/legal/legal-4'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal4Handlers } from '../../../../mocks/legal-4.ts'
import { owners } from '../fixtures/legal-4.ts'

const queryKey = ['data', 'legal', 'clients']

const LawFirmClients = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Legal4Mode>('table')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Legal4Client[]>('/data/legal/clients'),
    queryKey,
  })
  const update = (id: string, change: Partial<Legal4Client>) =>
    queryClient.setQueryData<Legal4Client[]>(queryKey, (current) =>
      current?.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal4
      clients={data ?? []}
      error={isError}
      mode={mode}
      onModeChange={setMode}
      onOwnerChange={(id, ownerId) => update(id, { ownerId })}
      onQueueChange={(id, queue) => update(id, { queue })}
      onRetry={() => refetch()}
      onStatusChange={(id, status) => update(id, { status })}
      owners={owners}
      pending={isPending}
    />
  )
}

const meta = {
  component: LawFirmClients,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal4/Usages',
} satisfies Meta<typeof LawFirmClients>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal4Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal4Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal4Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal4Handlers.error)
  },
}
