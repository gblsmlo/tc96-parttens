import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Stats1, type Stats1Stat } from '@tc96/blocks/application/stats/stats-1'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats1Handlers } from '../../../../mocks/stats-1.ts'

const OverviewStats = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Stats1Stat[]>('/stats/overview'),
    queryKey: ['stats', 'overview'],
  })

  return (
    <Stats1
      error={isError}
      onRetry={() => refetch()}
      pending={isPending}
      onStatAction={fn()}
      stats={data ?? []}
    />
  )
}

const meta = {
  component: OverviewStats,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Stats/Stats1/Usages',
} satisfies Meta<typeof OverviewStats>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('region', { name: 'Receita do mês' }),
    ).toBeVisible()
    await expect(canvas.getByText('Taxa de conversão')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os indicadores',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando indicadores'),
    ).toBeVisible()
  },
}
