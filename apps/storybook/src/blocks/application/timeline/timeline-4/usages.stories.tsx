import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Timeline4,
  type Timeline4Entry,
} from '@tc96/ui/blocks/application/timeline/timeline-4'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { timeline4Handlers } from '../../../../mocks/timeline-4.ts'

const ActivitySheet = () => {
  const [open, setOpen] = useState(false)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Timeline4Entry[]>('/timeline/activity'),
    queryKey: ['timeline', 'activity'],
  })

  return (
    <Timeline4
      entries={data ?? []}
      error={isError}
      onOpenChange={setOpen}
      onRetry={() => refetch()}
      open={open}
      pending={isPending}
    />
  )
}

const meta = {
  component: ActivitySheet,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Timeline/Timeline4/Usages',
} satisfies Meta<typeof ActivitySheet>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.pending)
  },
}
