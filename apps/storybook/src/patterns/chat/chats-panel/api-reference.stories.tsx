import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelList,
  ChatsPanelSkeleton,
} from '@tc96/parttens'
import { Slot } from '../../../test-utils/anatomy-slot'
import { channels } from './fixtures/chats'

const AvatarSlot = () => (
  <span className="flex size-(--avatar-size) items-center justify-center rounded-full border border-dashed text-muted-foreground text-xs">
    avatar
  </span>
)

const meta = {
  args: {
    actions: <Slot name="actions" />,
    className: 'h-72 w-96',
    title: <Slot name="title" />,
  },
  component: ChatsPanel,
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Chat/Chats Panel/API Reference',
} satisfies Meta<typeof ChatsPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: {
    children: (
      <ChatsPanelList>
        <ChatsPanelItem
          avatar={<AvatarSlot />}
          channel={channels.messenger}
          name={<Slot name="name" />}
          preview={<Slot name="preview" />}
          time={<Slot name="time" />}
          unreadCount={2}
          unreadLabel="2 unread"
        />
        <ChatsPanelItem
          avatar={<AvatarSlot />}
          name={<Slot name="ChatsPanelItem" />}
          preview={<Slot name="preview" />}
          time={<Slot name="time" />}
        />
      </ChatsPanelList>
    ),
    variant: 'card',
  },
}

export const SkeletonAnatomy: Story = {
  args: {
    children: <ChatsPanelSkeleton count={3} label="ChatsPanelSkeleton" />,
    variant: 'card',
  },
}
