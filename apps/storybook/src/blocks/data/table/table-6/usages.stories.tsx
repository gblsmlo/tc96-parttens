import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Table6,
  type Table6Account,
  type Table6Region,
  type Table6Summary,
} from '@tc96/ui/blocks/data/table/table-6'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { table6Handlers } from '../../../../mocks/table-6.ts'

interface RevenueResponse {
  accounts: Table6Account[]
  regions: Table6Region[]
  summary: Table6Summary
}

const RevenueByRegion = () => {
  const [collapsed, setCollapsed] = useState<readonly string[]>([])
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<RevenueResponse>('/data/table/revenue-by-region'),
    queryKey: ['data', 'table', 'revenue-by-region'],
  })

  return (
    <Table6
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
  title: 'Blocks/Data/Table/Table6/Usages',
} satisfies Meta<typeof RevenueByRegion>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table6Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Northwind Comércio')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Recolher tudo' }))
    await expect(canvas.queryByText('Northwind Comércio')).toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Expandir tudo' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table6Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma conta para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table6Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as contas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table6Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando contas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
  },
}
