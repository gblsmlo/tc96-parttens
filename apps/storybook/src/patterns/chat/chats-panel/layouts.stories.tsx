import type { Meta, StoryObj } from '@storybook/react-vite'
import { chatsPanelControlArgs } from './chats-panel-controls.ts'
import { ComposedChatsPanel, StandaloneList } from './chats-panel-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutActions: Story = {
  render: () => (
    <ComposedChatsPanel {...chatsPanelControlArgs} actions={false} />
  ),
}

export const NameAndAvatarOnly: Story = {
  render: () => (
    <ComposedChatsPanel
      {...chatsPanelControlArgs}
      channel={false}
      preview={false}
      time={false}
    />
  ),
}

export const ItemsAsLinks: Story = {
  render: () => (
    <ComposedChatsPanel {...chatsPanelControlArgs} itemElement="link" />
  ),
}

export const ListWithoutPanel: Story = {
  render: () => <StandaloneList />,
}
