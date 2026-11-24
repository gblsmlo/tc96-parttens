import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  List3,
  type List3Period,
  type List3Transaction,
} from '@tc96/blocks/application/list/list-3'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { list3Handlers } from '../../../../mocks/list-3.ts'

const TransactionsFeed = () => {
  const [period, setPeriod] = useState<List3Period>('month')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<List3Transaction[]>(`/list/transactions?period=${period}`),
    queryKey: ['list', 'transactions', period],
  })

  return (
    <List3
      error={isError}
      onPeriodChange={setPeriod}
      onRetry={() => refetch()}
      pending={isPending}
      period={period}
      transactions={data ?? []}
    />
  )
}

const meta = {
  component: TransactionsFeed,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/List/List3/Usages',
} satisfies Meta<typeof TransactionsFeed>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list3Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Pagamento do cliente Atlas'),
    ).toBeVisible()
    await expect(canvas.getByText('Aluguel do escritório')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list3Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma transação no período'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list3Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as transações',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list3Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando transações'),
    ).toBeVisible()
  },
}
