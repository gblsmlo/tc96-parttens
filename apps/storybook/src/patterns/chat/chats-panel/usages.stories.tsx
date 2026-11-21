import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ChatInbox } from './chats-panel-inbox.tsx'
import { LeadQualificationScreen } from './chats-panel-lead-qualification.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Inbox: Story = {
  render: () => <ChatInbox />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { current: true }),
    ).toHaveAccessibleName(/^Marina Costa/)
  },
}

export const InboxNoMatchingFilters: Story = {
  render: () => (
    <ChatInbox defaultChannel="instagram" defaultReadStatus="unread" />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nenhuma conversa encontrada')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Exibição (2)' }),
    ).toBeVisible()
  },
}

export const InboxWithoutConversations: Story = {
  render: () => <ChatInbox chats={[]} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nenhuma conversa')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const InboxLoading: Story = {
  render: () => <ChatInbox loading />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('status', { name: 'Carregando conversas' }),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const LeadQualification: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <LeadQualificationScreen />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list', { name: 'Conversas' })).toBeVisible()
    await expect(
      canvas.getByRole('log', { name: 'Mensagens com Renata Sousa' }),
    ).toBeVisible()
  },
}

export const LeadOutsideWindow: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <LeadQualificationScreen defaultSelectedLeadId="paulo" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Janela encerrada'),
    ).toBeVisible()
  },
}

export const LeadNoConversationOpen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <LeadQualificationScreen defaultSelectedLeadId={null} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma conversa aberta')).toBeVisible()
    await expect(canvas.queryByRole('complementary')).toBeNull()
  },
}
