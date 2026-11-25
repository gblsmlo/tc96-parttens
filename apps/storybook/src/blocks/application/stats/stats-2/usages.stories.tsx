import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Stats2 } from '@tc96/ui/blocks/application/stats/stats-2'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats2Handlers } from '../../../../mocks/stats-2.ts'
import type { QuotaUsage } from '../fixtures/stats-2.ts'

const ApiQuota = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<QuotaUsage>('/stats/quota'),
    queryKey: ['stats', 'quota'],
  })

  return (
    <Stats2
      className="mx-auto max-w-md"
      cost={data?.cost ?? 0}
      error={isError}
      limit={data?.limit ?? 0}
      onUpgrade={fn()}
      onRetry={() => refetch()}
      pending={isPending}
      renewsAt={new Date(data?.renewsAt ?? 0)}
      timeZone="UTC"
      used={data?.used ?? 0}
    />
  )
}

const meta = {
  component: ApiQuota,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Stats/Stats2/Usages',
} satisfies Meta<typeof ApiQuota>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats2Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats2Handlers.pending)
  },
}
