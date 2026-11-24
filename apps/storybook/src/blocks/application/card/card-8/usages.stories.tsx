import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Card8,
  type Card8Meeting,
} from '@tc96/ui/blocks/application/card/card-8'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
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
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Entrar na reunião Apollo CRM - Planejamento da sprint',
      }),
    )
    await expect(args.onJoin).toHaveBeenCalledWith('sprint')
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Mais ações de Delta Finanças - Alinhamento de orçamento',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Cancelar' }),
    )
    await expect(args.onActionSelect).toHaveBeenCalledWith('budget', 'cancel')
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card8Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma reunião agendada'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card8Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as reuniões',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card8Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando reuniões'),
    ).toBeVisible()
  },
}
