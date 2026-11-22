import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AssistantControls,
  assistantControlArgs,
  assistantControlArgTypes,
} from './assistant-controls.ts'
import { AssistantCanvas } from './assistant-frame.tsx'
import { ComposedAssistant } from './assistant-layouts.tsx'

const meta = {
  args: assistantControlArgs,
  argTypes: assistantControlArgTypes,
  decorators: [AssistantCanvas],
  parameters: {
    controls: { exclude: ['expanded', 'messages', 'placement', 'typing'] },
    layout: 'padded',
  },
  render: (args) => <ComposedAssistant {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Stories',
} satisfies Meta<AssistantControls>

export default meta

type Story = StoryObj<AssistantControls>

export const Default: Story = {}

export const Docked: Story = {
  args: { placement: 'docked' },
}

export const Expanded: Story = {
  args: { expanded: true },
}

export const Conversation: Story = {
  args: { messages: 'conversation' },
}

export const Failed: Story = {
  args: { messages: 'failed' },
}

export const Typing: Story = {
  args: { typing: true },
}
