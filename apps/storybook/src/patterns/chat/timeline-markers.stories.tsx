import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatDatePill } from '@tc96/ui/chat/chat-date-pill'
import { ChatUnreadDivider } from '@tc96/ui/chat/chat-unread-divider'
import { expect } from 'storybook/test'

const meta = {
  args: { children: '2 unread messages' },
  component: ChatUnreadDivider,
  decorators: [
    (Story) => (
      <div className="flex w-96 flex-col">
        <ChatDatePill>Yesterday</ChatDatePill>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Timeline markers: `ChatDatePill` sticks to the top of the conversation while its day scrolls, and `ChatUnreadDivider` marks the first unread message. Both take their copy as children.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Timeline Markers',
} satisfies Meta<typeof ChatUnreadDivider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Yesterday')).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="chat-unread-divider"]'),
    ).toHaveTextContent('2 unread messages')
  },
}

export const OneUnread: Story = {
  args: { children: '1 unread message' },
}
