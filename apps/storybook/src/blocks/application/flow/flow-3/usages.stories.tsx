import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Flow3,
  type Flow3Connection,
  type Flow3Step,
} from '@tc96/ui/blocks/application/flow/flow-3'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { flow3Handlers } from '../../../../mocks/flow-3.ts'

interface RunData {
  connections: Flow3Connection[]
  steps: Flow3Step[]
}

const ReleaseRun = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<RunData>('/flow/flow-3'),
    queryKey: ['flow', 'flow-3'],
    retry: false,
  })

  return (
    <Flow3
      connections={data?.connections ?? []}
      error={isError}
      onApprove={fn()}
      onReject={fn()}
      onReplay={fn()}
      onRetry={() => refetch()}
      pending={isPending}
      steps={data?.steps ?? []}
    />
  )
}

const meta = {
  component: ReleaseRun,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Flow/Flow3/Usages',
} satisfies Meta<typeof ReleaseRun>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow3Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow3Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow3Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow3Handlers.pending)
  },
}
