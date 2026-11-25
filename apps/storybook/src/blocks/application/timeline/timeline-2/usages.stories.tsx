import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Timeline2,
  type Timeline2Release,
} from '@tc96/ui/blocks/application/timeline/timeline-2'
import { fetchJson } from '../../../../mocks/api.ts'
import { timeline2Handlers } from '../../../../mocks/timeline-2.ts'

const ChangelogFeed = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Timeline2Release[]>('/timeline/releases'),
    queryKey: ['timeline', 'releases'],
    retry: false,
  })

  return (
    <Timeline2
      error={isError}
      releases={data ?? []}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: ChangelogFeed,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Timeline/Timeline2/Usages',
} satisfies Meta<typeof ChangelogFeed>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.pending)
  },
}
