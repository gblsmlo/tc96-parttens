import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  DataGrid1,
  type DataGrid1Sort,
  type DataGrid1Ticket,
} from '@tc96/ui/blocks/data/data-grid/data-grid-1'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dataGrid1Handlers } from '../../../../mocks/data-grid-1.ts'
import { initialSort, owners } from '../fixtures/data-grid-1.ts'

const SupportQueue = () => {
  const [sort, setSort] = useState<DataGrid1Sort | null>(initialSort)
  const [pageSize, setPageSize] = useState(6)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<DataGrid1Ticket[]>('/data/tickets'),
    queryKey: ['data', 'tickets'],
  })

  return (
    <DataGrid1
      error={isError}
      onPageSizeChange={setPageSize}
      onRetry={() => refetch()}
      onSortChange={setSort}
      owners={owners}
      pageSize={pageSize}
      pageSizeOptions={[6, 12, 24]}
      pending={isPending}
      sort={sort}
      tickets={data ?? []}
    />
  )
}

const meta = {
  component: SupportQueue,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/DataGrid/DataGrid1/Usages',
} satisfies Meta<typeof SupportQueue>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('SUP-1831')).toBeVisible()
    await expect(canvas.getByRole('grid')).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum chamado para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os chamados',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando chamados'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Fila de suporte' }),
    ).toBeVisible()
  },
}
