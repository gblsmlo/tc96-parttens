import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Stats7,
  type Stats7Metric,
} from '@tc96/ui/blocks/application/stats/stats-7'
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
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats7Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats7Handlers.pending)
  },
}
