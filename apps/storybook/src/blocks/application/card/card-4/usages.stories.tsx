import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Card4,
  type Card4Meeting,
} from '@tc96/ui/blocks/application/card/card-4'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card4Handlers } from '../../../../mocks/card-4.ts'

const onJoin = fn()

const MeetingsCard = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card4Meeting[]>('/cards/meetings'),
    queryKey: ['cards', 'meetings'],
  })

  return (
    <Card4
      error={isError}
      meetings={data ?? []}
      onJoin={onJoin}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: MeetingsCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card4/Usages',
} satisfies Meta<typeof MeetingsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    onJoin.mockClear()
    msw.use(card4Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card4Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card4Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card4Handlers.pending)
  },
}
