import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Revenue2,
  type Revenue2Condition,
  type Revenue2Renewal,
  type Revenue2Sort,
} from '@tc96/ui/blocks/data/revenue/revenue-2'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { revenue2Handlers } from '../../../../mocks/revenue-2.ts'
import {
  initialConditions,
  initialSort,
  owners,
} from '../fixtures/revenue-2.ts'

const RenewalsReview = () => {
  const [sort, setSort] = useState<Revenue2Sort | null>(initialSort)
  const [conditions, setConditions] =
    useState<Revenue2Condition[]>(initialConditions)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Revenue2Renewal[]>('/data/table/renewals'),
    queryKey: ['data', 'table', 'renewals'],
  })

  return (
    <Revenue2
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
  title: 'Blocks/Data/Revenue/Revenue2/Usages',
} satisfies Meta<typeof RenewalsReview>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Atlas Pagamentos')).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma renovação para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(revenue2Handlers.error)
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
    msw.use(revenue2Handlers.pending)
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
