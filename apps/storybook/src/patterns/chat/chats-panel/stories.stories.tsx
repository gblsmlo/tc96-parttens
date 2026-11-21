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
  parameters: {
    controls: { exclude: ['content', 'itemElement', 'selected', 'variant'] },
  },
  render: (args) => <ComposedChatsPanel {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Stories',
} satisfies Meta<ChatsPanelControls>

export default meta

type Story = StoryObj<ChatsPanelControls>

export const Default: Story = {}

export const Card: Story = {
  args: { variant: 'card' },
}

export const Inset: Story = {
  args: { variant: 'inset' },
}

export const SelectedItem: Story = {
  args: { selected: true },
}

export const Loading: Story = {
  args: { content: 'loading' },
}

export const Empty: Story = {
  args: { content: 'empty' },
}
