import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  type ChatMemberEntry,
  ChatMemberSection,
} from '@tc96/ui/chat/chat-members'
import { expect, fn, userEvent, within } from 'storybook/test'

const onRemove = fn((_name: string) => {})

function member(name: string, extra: Partial<ChatMemberEntry> = {}) {
  return {
    action: (
      <Button
        aria-label={`Remove ${name}`}
        onClick={() => onRemove(name)}
        size="xs"
        variant="ghost"
      >
        Remove
      </Button>
    ),
    avatar: (
      <Avatar aria-hidden="true" className="size-7 text-xs">
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
    id: name,
    name,
    ...extra,
  } satisfies ChatMemberEntry
}

const meta = {
  args: {
    heading: 'Members · 3',
    label: 'Members',
    members: [
      member('Casey', { badges: <Badge variant="outline">Owner</Badge> }),
      member('Jordan'),
      member('Sam', { dimmed: true }),
    ],
  },
  beforeEach: () => {
    onRemove.mockClear()
  },
  component: ChatMemberSection,
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
          'A labeled section of member rows. Each row takes the avatar, badges and action the consumer allows; `dimmed` marks a member who left. A section without members renders nothing.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Member Section',
} satisfies Meta<typeof ChatMemberSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const section = canvas.getByRole('region', { name: 'Members' })
    await expect(within(section).getAllByRole('listitem')).toHaveLength(3)
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Jordan' }))
    await expect(onRemove).toHaveBeenCalledWith('Jordan')
  },
}

export const WithoutActions: Story = {
  args: {
    heading: 'Read by',
    label: 'Read by',
    members: [member('Casey', { action: undefined })],
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const Empty: Story = {
  args: { members: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('region')).toBeNull()
  },
}
