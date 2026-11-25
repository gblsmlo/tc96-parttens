import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Revenue3,
  type Revenue3Account,
  type Revenue3Region,
  type Revenue3Summary,
} from '@tc96/ui/blocks/data/revenue/revenue-3'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { revenue3Handlers } from '../../../../mocks/revenue-3.ts'

interface RevenueResponse {
  accounts: Revenue3Account[]
  regions: Revenue3Region[]
  summary: Revenue3Summary
}

const RevenueByRegion = () => {
  const [collapsed, setCollapsed] = useState<readonly string[]>([])
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<RevenueResponse>('/data/revenue-by-region'),
    queryKey: ['data', 'revenue-by-region'],
  })

  return (
    <Revenue3
      accounts={data?.accounts ?? []}
      collapsedRegionIds={collapsed}
      error={isError}
      onCollapsedRegionIdsChange={setCollapsed}
      onRetry={() => refetch()}
      pending={isPending}
      regions={data?.regions ?? []}
      summary={data?.summary}
    />
  )
}

const meta = {
  component: RevenueByRegion,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Revenue/Revenue3/Usages',
} satisfies Meta<typeof RevenueByRegion>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue3Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue3Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue3Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue3Handlers.pending)
  },
}
