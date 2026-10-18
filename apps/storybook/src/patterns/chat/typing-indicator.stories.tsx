import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatTypingIndicator } from '@tc96/ui/chat/chat-typing-indicator'
import { expect, waitFor } from 'storybook/test'

const meta = {
  args: { label: 'Casey is typing…', visible: true },
  component: ChatTypingIndicator,
  parameters: {
    docs: {
      description: {
        component:
          'Who is typing, as a `role="status"` with animated dots. `visible` animates it in and out; the dots stop under reduced motion.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Typing Indicator',
} satisfies Meta<typeof ChatTypingIndicator>

export default meta
type Story = StoryObj<typeof meta>

async function waitForEntrance(status: HTMLElement) {
  const wrapper = status.parentElement
  if (!wrapper) throw new Error('The typing indicator did not render.')
  await waitFor(() => expect(getComputedStyle(wrapper).opacity).toBe('1'))
}

export const Visible: Story = {
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status')
    await expect(status).toHaveTextContent('Casey is typing…')
    await waitForEntrance(status)
  },
}

export const SeveralPeople: Story = {
  args: { label: 'Casey and Jordan are typing…' },
  play: async ({ canvas }) => {
    await waitForEntrance(canvas.getByRole('status'))
  },
}

export const Hidden: Story = {
  args: { visible: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('status')).toBeNull()
  },
}
