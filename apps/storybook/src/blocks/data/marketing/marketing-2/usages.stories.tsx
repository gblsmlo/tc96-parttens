import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Marketing2,
  type Marketing2Campaign,
  type Marketing2Summary,
} from '@tc96/ui/blocks/data/marketing/marketing-2'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { marketing2Handlers } from '../../../../mocks/marketing-2.ts'
import {
  summary as emptySummary,
  factorySettings,
  type Marketing2ViewSettings,
  period,
} from '../fixtures/marketing-2.ts'

interface CampaignsResponse {
  campaigns: Marketing2Campaign[]
  summary: Marketing2Summary
}

const CampaignPerformance = () => {
  const [settings, setSettings] =
    useState<Marketing2ViewSettings>(factorySettings)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<CampaignsResponse>('/data/table/campaigns'),
    queryKey: ['data', 'table', 'campaigns'],
  })

  return (
    <Marketing2
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
  title: 'Blocks/Data/Marketing/Marketing2/Usages',
} satisfies Meta<typeof CampaignPerformance>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Liquidação de Primavera'),
    ).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma campanha para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as campanhas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(marketing2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando campanhas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Desempenho de campanhas' }),
    ).toBeVisible()
  },
}
