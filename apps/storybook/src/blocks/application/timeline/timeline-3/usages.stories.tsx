import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Timeline3,
  type Timeline3Step,
} from '@tc96/ui/blocks/application/timeline/timeline-3'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { timeline3Handlers } from '../../../../mocks/timeline-3.ts'

const ApprovalTrack = () => {
  const [decisions, setDecisions] = useState<
    Record<string, Timeline3Step['status']>
  >({})
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Timeline3Step[]>('/timeline/approval'),
    queryKey: ['timeline', 'approval'],
  })

  const steps = (data ?? []).map((step) => ({
    ...step,
    status: decisions[step.id] ?? step.status,
  }))
  const current = steps.find((step) => step.status === 'pending')

  return (
    <Timeline3
      currentStepId={current?.id}
      error={isError}
      onApprove={(id) =>
        setDecisions((prev) => ({ ...prev, [id]: 'approved' }))
      }
      onReject={(id) => setDecisions((prev) => ({ ...prev, [id]: 'rejected' }))}
      onRetry={() => refetch()}
      pending={isPending}
      steps={steps}
    />
  )
}

const meta = {
  component: ApprovalTrack,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Timeline/Timeline3/Usages',
} satisfies Meta<typeof ApprovalTrack>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline3Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline3Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline3Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline3Handlers.pending)
  },
}
