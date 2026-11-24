import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  DataGrid3,
  type DataGrid3Condition,
  type DataGrid3Renewal,
  type DataGrid3Sort,
} from '@tc96/ui/blocks/data/data-grid/data-grid-3'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { dataGrid3Handlers } from '../../../../mocks/data-grid-3.ts'
import {
  initialConditions,
  initialSort,
  owners,
} from '../fixtures/data-grid-3.ts'

const RenewalsReview = () => {
  const [sort, setSort] = useState<DataGrid3Sort | null>(initialSort)
  const [conditions, setConditions] =
    useState<DataGrid3Condition[]>(initialConditions)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<DataGrid3Renewal[]>('/data/renewals'),
    queryKey: ['data', 'renewals'],
  })

  return (
    <DataGrid3
      error={isError}
      conditions={conditions}
      onConditionsChange={setConditions}
      onRetry={() => refetch()}
      onSortChange={setSort}
      owners={owners}
      pageSize={8}
      pending={isPending}
      sort={sort}
      renewals={data ?? []}
    />
  )
}

const meta = {
  component: RenewalsReview,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/DataGrid/DataGrid3/Usages',
} satisfies Meta<typeof RenewalsReview>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid3Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Atlas Pagamentos')).toBeVisible()
    await expect(canvas.getByRole('grid')).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid3Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma renovação para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid3Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as renovações',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid3Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando renovações'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Revisão de renovações' }),
    ).toBeVisible()
  },
}
