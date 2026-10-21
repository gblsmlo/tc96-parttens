import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatDeliveryIndicator } from '@tc96/ui/chat/chat-delivery-indicator'
import { ChatMessageFooter } from '@tc96/ui/chat/chat-message-layout'
import { expect } from 'storybook/test'

const meta = {
  args: { label: 'Sent', status: 'sent' },
  component: ChatDeliveryIndicator,
  decorators: [
    (Story) => (
      <ChatMessageFooter>
        <span>09:42</span>
        <Story />
      </ChatMessageFooter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Delivery status of an outgoing message, for the message `footer`. It is an image named by `label`, so the label carries the status for assistive technology; `read` and `failed` also change color.',
      },
    },
  },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole('img', { name: args.label })).toHaveAttribute(
      'title',
      args.label,
    )
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Delivery Indicator',
} satisfies Meta<typeof ChatDeliveryIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Sending: Story = { args: { label: 'Sending', status: 'sending' } }

export const Sent: Story = {}

export const Delivered: Story = {
  args: { label: 'Delivered', status: 'delivered' },
}

export const Read: Story = { args: { label: 'Read', status: 'read' } }

export const Failed: Story = {
  args: { label: 'Not delivered', status: 'failed' },
}
