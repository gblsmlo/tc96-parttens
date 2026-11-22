import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ChatsPanelControls,
  chatsPanelControlArgs,
  chatsPanelControlArgTypes,
} from './chats-panel-controls.ts'
import { ComposedChatsPanel } from './chats-panel-layouts.tsx'

const meta = {
  args: chatsPanelControlArgs,
  argTypes: chatsPanelControlArgTypes,
  render: (args) => <ComposedChatsPanel {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Playground',
} satisfies Meta<ChatsPanelControls>

export default meta

type Story = StoryObj<ChatsPanelControls>

export const Playground: Story = {}
