import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatReplyReference } from '@tc96/ui/chat/chat-reply-reference'
import { expect, fn, userEvent } from 'storybook/test'

const meta = {
  args: {
    author: 'Casey',
    onClick: fn(),
    preview: 'Can you review the onboarding copy before Friday?',
  },
  component: ChatReplyReference,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'The quoted message above a reply. It is a button: `onClick` hands the navigation to the consumer, which scrolls to the source and sets `highlighted` on it. The preview stops at two lines.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Reply Reference',
} satisfies Meta<typeof ChatReplyReference>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Casey/ }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const LongPreview: Story = {
  args: {
    preview:
      'The onboarding flow asks for the workspace name, then invites the team and finally connects the calendar. Each step keeps the previous answers so nobody types twice.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/onboarding flow/)).toHaveClass(
      'line-clamp-2',
    )
  },
}

export const Unavailable: Story = {
  args: { disabled: true, preview: 'This message was deleted.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Casey/ })).toBeDisabled()
  },
}
