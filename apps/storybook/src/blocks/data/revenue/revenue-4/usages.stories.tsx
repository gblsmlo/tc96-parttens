import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Revenue4,
  type Revenue4Account,
  type Revenue4Region,
  type Revenue4Summary,
} from '@tc96/ui/blocks/data/revenue/revenue-4'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { revenue4Handlers } from '../../../../mocks/revenue-4.ts'

interface RevenueResponse {
  accounts: Revenue4Account[]
  regions: Revenue4Region[]
  summary: Revenue4Summary
}

const RevenueByRegion = () => {
  const [collapsed, setCollapsed] = useState<readonly string[]>([])
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<RevenueResponse>('/data/table/revenue-by-region'),
    queryKey: ['data', 'table', 'revenue-by-region'],
  })

  return (
    <Revenue4
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
  title: 'Blocks/Data/Revenue/Revenue4/Usages',
} satisfies Meta<typeof RevenueByRegion>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue4Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue4Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue4Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue4Handlers.pending)
  },
}
