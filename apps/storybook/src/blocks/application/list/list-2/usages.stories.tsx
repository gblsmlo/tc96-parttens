import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  List2,
  type List2Entry,
  type List2Range,
} from '@tc96/ui/blocks/application/list/list-2'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { list2Handlers } from '../../../../mocks/list-2.ts'

const Leaderboard = () => {
  const [range, setRange] = useState<List2Range>('30d')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<List2Entry[]>(`/list/leaderboard?range=${range}`),
    queryKey: ['list', 'leaderboard', range],
  })

  return (
    <List2
      entries={data ?? []}
      error={isError}
      onRangeChange={setRange}
      onRetry={() => refetch()}
      pending={isPending}
      range={range}
    />
  )
}

const meta = {
  component: Leaderboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/List/List2/Usages',
} satisfies Meta<typeof Leaderboard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.pending)
  },
}
