import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Legal3,
  type Legal3Deadline,
  type Legal3Mode,
} from '@tc96/ui/blocks/data/legal/legal-3'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal3Handlers } from '../../../../mocks/legal-3.ts'
import { calendarAnchor, calendarNow, owners } from '../fixtures/legal-3.ts'

const queryKey = ['data', 'legal', 'deadlines']

const LawFirmDeadlines = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Legal3Mode>('table')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Legal3Deadline[]>('/data/legal/deadlines'),
    queryKey,
  })
  const update = (id: string, change: Partial<Legal3Deadline>) =>
    queryClient.setQueryData<Legal3Deadline[]>(queryKey, (current) =>
      current?.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal3
      anchor={calendarAnchor}
      now={calendarNow}
      deadlines={data ?? []}
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
  component: LawFirmDeadlines,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal3/Usages',
} satisfies Meta<typeof LawFirmDeadlines>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal3Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal3Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal3Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal3Handlers.error)
  },
}
