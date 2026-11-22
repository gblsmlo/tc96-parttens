import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { AssistantPanel } from '@tc96/parttens'
import { Slot } from '../../../test-utils/anatomy-slot'

const AnatomyCanvas: Decorator = (Story) => (
  <div className="h-[38rem] w-96 max-w-full">
    <Story />
  </div>
)

const noop = () => {}

const meta = {
  args: {
    disclaimer: <Slot name="disclaimer" />,
    labels: { title: 'labels.title' },
    messages: [],
    onAttach: noop,
    onEnd: noop,
    onExpandedChange: noop,
    onHistory: noop,
    onNewChat: noop,
    onSend: noop,
    placeholder: 'AssistantComposer',
  },
  component: AssistantPanel,
  decorators: [AnatomyCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Chat/Assistant/API Reference',
} satisfies Meta<typeof AssistantPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: {
    description: <Slot name="description" />,
    greeting: <Slot name="greeting" />,
    suggestions: [
      { id: 'first', label: 'AssistantSuggestions: suggestions[0]' },
      { id: 'second', label: 'AssistantSuggestions: suggestions[1]' },
    ],
  },
}

export const ConversationAnatomy: Story = {
  args: {
    messages: [
      { id: 'user', role: 'user', text: 'messages: role "user"' },
      {
        id: 'assistant',
        role: 'assistant',
        text: 'messages: role "assistant"',
      },
      {
        error: true,
        id: 'error',
        role: 'assistant',
        text: 'messages: error',
      },
    ],
    onRetry: noop,
    typing: true,
  },
}
