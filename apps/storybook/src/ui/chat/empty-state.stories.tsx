import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { ChatEmptyState } from '@tc96/ui/chat/chat-states'
import {
  BanIcon,
  CloudAlertIcon,
  MessagesSquareIcon,
  ShieldOffIcon,
} from 'lucide-react'
import { expect, fn, userEvent } from 'storybook/test'

const onAction = fn()

const icons = {
  Ban: <BanIcon aria-hidden="true" />,
  CloudAlert: <CloudAlertIcon aria-hidden="true" />,
  Messages: <MessagesSquareIcon aria-hidden="true" />,
  ShieldOff: <ShieldOffIcon aria-hidden="true" />,
}

const actions = {
  None: undefined,
  Join: <Button onClick={onAction}>Join conversation</Button>,
  Retry: (
    <Button onClick={onAction} variant="outline">
      Retry
    </Button>
  ),
}

const meta = {
  args: {
    children: 'Join',
    description: 'Join to read the history and send messages.',
    icon: 'Messages',
    title: 'Product launch',
  },
  argTypes: {
    children: {
      control: 'select',
      mapping: actions,
      options: Object.keys(actions),
    },
    icon: { control: 'select', mapping: icons, options: Object.keys(icons) },
  },
  beforeEach: () => {
    onAction.mockClear()
  },
  component: ChatEmptyState,
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
          'Replaces the timeline when there is no history to show. The consumer picks the state and its recovery: join when not joined, retry after a history error, and no action when access was lost or the member was banned. None of these states shows the composer.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Empty State',
} satisfies Meta<typeof ChatEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const NotJoined: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Product launch')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Join conversation' }),
    )
    await expect(onAction).toHaveBeenCalledTimes(1)
  },
}

export const HistoryError: Story = {
  args: {
    children: 'Retry',
    description: 'The messages could not be loaded.',
    icon: 'CloudAlert',
    title: 'History unavailable',
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(onAction).toHaveBeenCalledTimes(1)
  },
}

export const AccessLost: Story = {
  args: {
    children: 'None',
    description: 'You no longer have access to this conversation.',
    icon: 'ShieldOff',
    title: 'Access removed',
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const Banned: Story = {
  args: {
    children: 'None',
    description: 'You cannot rejoin while the ban is active.',
    icon: 'Ban',
    title: 'You were banned',
  },
}
