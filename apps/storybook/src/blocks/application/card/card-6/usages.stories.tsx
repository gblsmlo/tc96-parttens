import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card6, type Card6Job } from '@tc96/ui/blocks/application/card/card-6'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card6Handlers } from '../../../../mocks/card-6.ts'

const onApply = fn()

const JobsCard = () => {
  const [saved, setSaved] = useState<string[]>([])
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card6Job[]>('/cards/jobs'),
    queryKey: ['cards', 'jobs'],
  })

  return (
    <Card6
      error={isError}
      jobs={data ?? []}
      onApply={onApply}
      onSaveChange={(jobId, next) =>
        setSaved((current) =>
          next ? [...current, jobId] : current.filter((id) => id !== jobId),
        )
      }
      onRetry={() => refetch()}
      pending={isPending}
      saved={saved}
    />
  )
}

const meta = {
  component: JobsCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card6/Usages',
} satisfies Meta<typeof JobsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    onApply.mockClear()
    msw.use(card6Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card6Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card6Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card6Handlers.pending)
  },
}
