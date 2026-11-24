import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  DataGrid9,
  type DataGrid9Campaign,
  type DataGrid9Summary,
} from '@tc96/ui/blocks/data/data-grid/data-grid-9'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dataGrid9Handlers } from '../../../../mocks/data-grid-9.ts'
import {
  type DataGrid9ViewSettings,
  summary as emptySummary,
  factorySettings,
  period,
  views,
} from '../fixtures/data-grid-9.ts'

interface CampaignsResponse {
  campaigns: DataGrid9Campaign[]
  summary: DataGrid9Summary
}

const CampaignPerformance = () => {
  const [settings, setSettings] =
    useState<DataGrid9ViewSettings>(factorySettings)
  const [activeViewId, setActiveViewId] = useState('all')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<CampaignsResponse>('/data/campaigns'),
    queryKey: ['data', 'campaigns'],
  })

  return (
    <DataGrid9
      activeViewId={activeViewId}
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
      onViewChange={(viewId) => {
        const view = views.find((option) => option.id === viewId)
        if (view) setSettings(view.settings)
        setActiveViewId(viewId)
      }}
      pageSize={6}
      pageSizeOptions={[6, 12]}
      pending={isPending}
      period={period}
      sort={settings.sort}
      summary={data?.summary ?? emptySummary}
      views={views}
    />
  )
}

const meta = {
  component: CampaignPerformance,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/DataGrid/DataGrid9/Usages',
} satisfies Meta<typeof CampaignPerformance>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid9Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Liquidação de Primavera'),
    ).toBeVisible()
    await expect(canvas.getByRole('grid')).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await userEvent.click(
      canvas.getByRole('button', { name: /Todas as campanhas/ }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Retorno' }),
    )
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: /Retorno/ })).toBeVisible(),
    )
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid9Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma campanha para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid9Handlers.error)
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
    msw.use(dataGrid9Handlers.pending)
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
