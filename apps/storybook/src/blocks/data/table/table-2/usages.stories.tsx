import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Table2,
  type Table2Member,
  type Table2Settings,
} from '@tc96/ui/blocks/data/table/table-2'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { table2Handlers } from '../../../../mocks/table-2.ts'
import { factorySettings, views } from '../fixtures/table-2.ts'

const TeamMembers = () => {
  const [settings, setSettings] = useState<Table2Settings>(factorySettings)
  const [activeViewId, setActiveViewId] = useState('all')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Table2Member[]>('/data/table/members'),
    queryKey: ['data', 'table', 'members'],
  })

  return (
    <Table2
      activeViewId={activeViewId}
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
      onViewChange={(viewId) => {
        const view = views.find((option) => option.id === viewId)
        if (view) setSettings(view.settings)
        setActiveViewId(viewId)
      }}
      pageSize={6}
      pageSizeOptions={[6, 12]}
      pending={isPending}
      showPaused={settings.showPaused}
      sort={settings.sort}
      views={views}
    />
  )
}

const meta = {
  component: TeamMembers,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Table/Table2/Usages',
} satisfies Meta<typeof TeamMembers>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Ana Souza')).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: /Todos os membros/ }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Recém-chegados' }),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: /Recém-chegados/ }),
      ).toBeVisible(),
    )
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum membro para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table2Handlers.error)
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
    msw.use(table2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando membros'),
    ).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Membros' })).toBeVisible()
  },
}
