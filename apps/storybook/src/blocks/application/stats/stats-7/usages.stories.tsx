import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Stats7,
  type Stats7Metric,
} from '@tc96/ui/blocks/application/stats/stats-7'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats7Handlers } from '../../../../mocks/stats-7.ts'

const ProductMetrics = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Stats7Metric[]>('/stats/product-metrics'),
    queryKey: ['stats', 'product-metrics'],
    retry: false,
  })

  return (
    <Stats7
      error={isError}
      metrics={data ?? []}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: ProductMetrics,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Stats/Stats7/Usages',
} satisfies Meta<typeof ProductMetrics>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats7Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('region', { name: 'Cadastros' }),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats7Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as métricas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats7Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando métricas'),
    ).toBeVisible()
  },
}
