import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Legal2,
  type Legal2Contract,
  type Legal2Mode,
} from '@tc96/ui/blocks/data/legal/legal-2'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal2Handlers } from '../../../../mocks/legal-2.ts'
import { owners } from '../fixtures/legal-2.ts'

const queryKey = ['data', 'legal', 'contracts']

const LawFirmContracts = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Legal2Mode>('table')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Legal2Contract[]>('/data/legal/contracts'),
    queryKey,
  })
  const update = (id: string, change: Partial<Legal2Contract>) =>
    queryClient.setQueryData<Legal2Contract[]>(queryKey, (current) =>
      current?.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal2
      contracts={data ?? []}
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
  component: LawFirmContracts,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal2/Usages',
} satisfies Meta<typeof LawFirmContracts>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal2Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal2Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal2Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal2Handlers.error)
  },
}
