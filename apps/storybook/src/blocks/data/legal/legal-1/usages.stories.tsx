import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Legal1,
  type Legal1Case,
  type Legal1Mode,
  type Legal1View,
} from '@tc96/ui/blocks/data/legal/legal-1'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { legal1Handlers } from '../../../../mocks/legal-1.ts'
import { owners } from '../fixtures/legal-1.ts'

const queryKey = ['data', 'legal', 'cases']

const LawFirmCases = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Legal1Mode>('table')
  const [view, setView] = useState<Legal1View>('all')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Legal1Case[]>('/data/legal/cases'),
    queryKey,
  })
  const update = (id: string, change: Partial<Legal1Case>) =>
    queryClient.setQueryData<Legal1Case[]>(queryKey, (current) =>
      current?.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal1
      cases={data ?? []}
      error={isError}
      mode={mode}
      onModeChange={setMode}
      onOwnerChange={(id, ownerId) => update(id, { ownerId })}
      onPhaseChange={(id, phase) => update(id, { phase })}
      onQueueChange={(id, queue) => update(id, { queue })}
      onRetry={() => refetch()}
      onStatusChange={(id, status) => update(id, { status })}
      onViewChange={setView}
      owners={owners}
      pending={isPending}
      view={view}
    />
  )
}

const meta = {
  component: LawFirmCases,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Legal/Legal1/Usages',
} satisfies Meta<typeof LawFirmCases>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal1Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal1Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(legal1Handlers.error)
  },
}
