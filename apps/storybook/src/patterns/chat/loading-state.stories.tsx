import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatLoadingState } from '@tc96/ui/chat/chat-states'
import { expect } from 'storybook/test'

const meta = {
  args: { label: 'Loading messages' },
  component: ChatLoadingState,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Skeleton rows while the history loads, announced by `label`. Keep the composer disabled meanwhile.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Loading State',
} satisfies Meta<typeof ChatLoadingState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Loading messages',
    )
  },
}
