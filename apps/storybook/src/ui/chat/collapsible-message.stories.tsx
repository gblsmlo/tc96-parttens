import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatBubble } from '@tc96/ui/chat/chat-bubble'
import { ChatCollapsibleMessage } from '@tc96/ui/chat/chat-collapsible-message'
import { ChatMessageText } from '@tc96/ui/chat/chat-message-text'
import { expect, fn, userEvent } from 'storybook/test'

const longText = [
  '@Jordan here is the full walkthrough.',
  ...Array.from(
    { length: 6 },
    (_, index) =>
      `Section ${index + 1}: the onboarding flow asks for the workspace name, then invites the team and finally connects the calendar. Each step keeps the previous answers so nobody types twice.`,
  ),
].join('\n\n')

const meta = {
  args: {
    onOpenChange: fn(),
    renderText: (text: string) => (
      <ChatMessageText mentions={['Jordan']} text={text} />
    ),
    showLessLabel: 'Show less',
    showMoreLabel: 'Show more',
    side: 'incoming',
    text: longText,
  },
  component: ChatCollapsibleMessage,
  decorators: [
    (Story) => (
      <div className="w-96">
        <ChatBubble variant="muted">
          <Story />
        </ChatBubble>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Long message text cut at `maxPreviewLength` behind a show more trigger. Text that fits renders whole, with no trigger. `renderText` keeps the mention formatting of `ChatMessageText` in both the preview and the full text.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Collapsible Message',
} satisfies Meta<typeof ChatCollapsibleMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Collapsed: Story = {
  play: async ({ args, canvas }) => {
    const more = canvas.getByRole('button', { name: 'Show more' })
    await expect(more).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(more)
    await expect(args.onOpenChange).toHaveBeenCalledWith(true)
    const less = canvas.getByRole('button', { name: 'Show less' })
    await expect(less).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(less)
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Show less' }),
    ).toHaveAttribute('aria-expanded', 'true')
  },
}

export const ShortText: Story = {
  args: { text: 'Short notes stay whole.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Short notes stay whole.')).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}
