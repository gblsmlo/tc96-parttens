import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { ChatDatePill } from '@tc96/ui/chat/chat-date-pill'
import {
  ChatDeliveryIndicator,
  type ChatDeliveryIndicatorProps,
} from '@tc96/ui/chat/chat-delivery-indicator'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatTypingIndicator } from '@tc96/ui/chat/chat-typing-indicator'
import { ChatUnreadDivider } from '@tc96/ui/chat/chat-unread-divider'
import { useState } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'

const meta = {
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
          'Timeline markers: the sticky date pill, the unread boundary, the typing indicator and the delivery status of a sent message.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Timeline',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DateAndUnread: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ChatDatePill>Yesterday</ChatDatePill>
      <ChatMessage author="Casey" side="incoming">
        Pushed the copy changes.
      </ChatMessage>
      <ChatUnreadDivider>2 unread messages</ChatUnreadDivider>
      <ChatMessage author="Casey" side="incoming">
        Can you take a look today?
      </ChatMessage>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Yesterday')).toBeVisible()
    await expect(canvas.getByText('2 unread messages')).toBeVisible()
  },
}

export const Typing: Story = {
  render: function Typing() {
    const [visible, setVisible] = useState(true)
    return (
      <div className="flex flex-col gap-4">
        <ChatTypingIndicator label="Casey is typing…" visible={visible} />
        <Button
          onClick={() => setVisible((current) => !current)}
          size="sm"
          variant="outline"
        >
          {visible ? 'Stop typing' : 'Start typing'}
        </Button>
      </div>
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Casey is typing…',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Stop typing' }))
    await waitFor(() => expect(canvas.queryByRole('status')).toBeNull())
  },
}

const statuses: {
  label: string
  status: ChatDeliveryIndicatorProps['status']
}[] = [
  { label: 'Sending', status: 'sending' },
  { label: 'Sent', status: 'sent' },
  { label: 'Delivered', status: 'delivered' },
  { label: 'Read', status: 'read' },
  { label: 'Not delivered', status: 'failed' },
]

export const DeliveryStatus: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {statuses.map(({ label, status }) => (
        <ChatMessage
          footer={
            <>
              <span>09:42</span>
              <ChatDeliveryIndicator label={label} status={status} />
            </>
          }
          key={status}
          side="outgoing"
        >
          {label}
        </ChatMessage>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const { label } of statuses)
      await expect(canvas.getByRole('img', { name: label })).toBeVisible()
  },
}
