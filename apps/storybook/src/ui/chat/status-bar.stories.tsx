import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { ChatStatusBar } from '@tc96/ui/chat/chat-states'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, userEvent } from 'storybook/test'

const onReconnect = fn()

const actions = {
  None: undefined,
  Reconnect: (
    <Button onClick={onReconnect} size="sm" variant="outline">
      Reconnect
    </Button>
  ),
  Reconnecting: (
    <Button disabled size="sm" variant="outline">
      <Spinner aria-hidden="true" />
      Reconnecting
    </Button>
  ),
}

const meta = {
  args: {
    action: 'Reconnect',
    description: 'Messages you send will wait until the connection is back.',
    title: 'Offline',
  },
  argTypes: {
    action: {
      control: 'select',
      mapping: actions,
      options: Object.keys(actions),
    },
  },
  beforeEach: () => {
    onReconnect.mockClear()
  },
  component: ChatStatusBar,
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
          'Connection feedback above the composer. The timeline keeps the cached history and the composer stays disabled until the connection is back.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Status Bar',
} satisfies Meta<typeof ChatStatusBar>

export default meta
type Story = StoryObj<typeof meta>

export const Disconnected: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reconnect' }))
    await expect(onReconnect).toHaveBeenCalledTimes(1)
  },
}

export const Reconnecting: Story = {
  args: { action: 'Reconnecting', title: 'Reconnecting' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Reconnecting' }),
    ).toBeDisabled()
  },
}
