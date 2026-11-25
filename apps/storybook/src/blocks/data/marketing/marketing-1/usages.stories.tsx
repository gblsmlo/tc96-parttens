import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Marketing1,
  type Marketing1Campaign,
  type Marketing1Summary,
} from '@tc96/ui/blocks/data/marketing/marketing-1'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { marketing1Handlers } from '../../../../mocks/marketing-1.ts'
import {
  summary as emptySummary,
  factorySettings,
  type Marketing1ViewSettings,
  period,
} from '../fixtures/marketing-1.ts'

interface CampaignsResponse {
  campaigns: Marketing1Campaign[]
  summary: Marketing1Summary
}

const CampaignPerformance = () => {
  const [settings, setSettings] =
    useState<Marketing1ViewSettings>(factorySettings)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<CampaignsResponse>('/data/campaigns'),
    queryKey: ['data', 'campaigns'],
  })

  return (
    <Marketing1
      campaigns={data?.campaigns ?? []}
      columnVisibility={settings.columnVisibility}
      density={settings.density}
      error={isError}
      onColumnVisibilityChange={(columnVisibility) =>
        setSettings((current) => ({ ...current, columnVisibility }))
      }
      onDensityChange={(density) =>
        setSettings((current) => ({ ...current, density }))
      }
      onRetry={() => refetch()}
      onSortChange={(sort) => setSettings((current) => ({ ...current, sort }))}
      pageSize={6}
      pageSizeOptions={[6, 12]}
      pending={isPending}
      period={period}
      sort={settings.sort}
      summary={data?.summary ?? emptySummary}
    />
  )
}

const meta = {
  component: CampaignPerformance,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Marketing/Marketing1/Usages',
} satisfies Meta<typeof CampaignPerformance>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing1Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing1Handlers.pending)
  },
}
