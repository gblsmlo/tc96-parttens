import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Card3,
  type Card3Profile,
} from '@tc96/ui/blocks/application/card/card-3'
import { fetchJson } from '../../../../mocks/api.ts'
import { card3Handlers } from '../../../../mocks/card-3.ts'

const TeamMember = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card3Profile>('/card/profile'),
    queryKey: ['card', 'profile'],
  })

  return (
    <Card3
      error={isError}
      onFollow={() => {}}
      onMessage={() => {}}
      onRetry={() => refetch()}
      pending={isPending}
      profile={data}
    />
  )
}

const meta = {
  component: TeamMember,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card3/Usages',
} satisfies Meta<typeof TeamMember>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card3Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card3Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card3Handlers.pending)
  },
}
