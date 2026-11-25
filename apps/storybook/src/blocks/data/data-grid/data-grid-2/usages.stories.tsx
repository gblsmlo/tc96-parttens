import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  DataGrid2,
  type DataGrid2Member,
  type DataGrid2Settings,
} from '@tc96/ui/blocks/data/data-grid/data-grid-2'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dataGrid2Handlers } from '../../../../mocks/data-grid-2.ts'
import { factorySettings } from '../fixtures/data-grid-2.ts'

const TeamMembers = () => {
  const [settings, setSettings] = useState<DataGrid2Settings>(factorySettings)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<DataGrid2Member[]>('/data/members'),
    queryKey: ['data', 'members'],
  })

  return (
    <DataGrid2
      columnVisibility={settings.columnVisibility}
      density={settings.density}
      error={isError}
      members={data ?? []}
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
      showPaused={settings.showPaused}
      sort={settings.sort}
    />
  )
}

const meta = {
  component: TeamMembers,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/DataGrid/DataGrid2/Usages',
} satisfies Meta<typeof TeamMembers>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Ana Souza')).toBeVisible()
    await expect(canvas.getByRole('grid')).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Membros' })).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum membro para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os membros',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando membros'),
    ).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Membros' })).toBeVisible()
  },
}
