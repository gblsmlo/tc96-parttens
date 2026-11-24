import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Stats6,
  type Stats6Period,
  type Stats6Sleeve,
} from '@tc96/blocks/application/stats/stats-6'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats6Handlers } from '../../../../mocks/stats-6.ts'

const PortfolioCard = () => {
  const [period, setPeriod] = useState<Stats6Period>('month')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<Stats6Sleeve[]>(`/stats/portfolio?period=${period}`),
    queryKey: ['stats', 'portfolio', period],
  })

  return (
    <Stats6
      error={isError}
      onRetry={() => refetch()}
      pending={isPending}
      onPeriodChange={setPeriod}
      period={period}
      sleeves={data ?? []}
    />
  )
}

const meta = {
  component: PortfolioCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Stats/Stats6/Usages',
} satisfies Meta<typeof PortfolioCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats6Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Renda fixa')).toBeVisible()
    await expect(canvas.getByText('Ações')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats6Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar a carteira',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats6Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando carteira'),
    ).toBeVisible()
  },
}
