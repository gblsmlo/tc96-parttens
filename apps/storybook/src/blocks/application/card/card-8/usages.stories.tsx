import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Card8,
  type Card8Meeting,
} from '@tc96/ui/blocks/application/card/card-8'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card8Handlers } from '../../../../mocks/card-8.ts'
import { meetingActions } from '../fixtures/card-8.tsx'

const ContactMeetings = ({
  contactId,
  onActionSelect,
  onJoin,
}: {
  contactId: string
  onActionSelect: (meetingId: string, actionId: string) => void
  onJoin: (meetingId: string) => void
}) => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<Card8Meeting[]>(`/crm/contacts/${contactId}/meetings`),
    queryKey: ['crm', 'contacts', contactId, 'meetings'],
  })

  return (
    <Card8
      actions={meetingActions}
      error={isError}
      labels={{ title: 'Reuniões do contato' }}
      meetings={data ?? []}
      onActionSelect={onActionSelect}
      onJoin={onJoin}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  args: { contactId: 'mara-alves', onActionSelect: fn(), onJoin: fn() },
  component: ContactMeetings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card8/Usages',
} satisfies Meta<typeof ContactMeetings>

export default meta

type Story = StoryObj<typeof meta>

export const CrmContactMeetings: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card8Handlers.loaded)
  },
  name: 'CRM contact meetings',
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card8Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card8Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card8Handlers.pending)
  },
}
