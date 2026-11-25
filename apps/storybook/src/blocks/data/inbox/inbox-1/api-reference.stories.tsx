import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox1 } from '@tc96/ui/blocks/data/inbox/inbox-1'
import { fn } from 'storybook/test'
import { entries, originColors, readInbox } from '../fixtures/inbox-1.ts'

const meta = {
  args: {
    entries: readInbox(entries).items,
    hasMore: true,
    onCategoryChange: fn(),
    onLoadMore: fn(),
    onMarkRead: fn(),
    onOpen: fn(),
    onReadChange: fn(),
    originColors,
  },
  component: Inbox1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Inbox/Inbox1/API Reference',
} satisfies Meta<typeof Inbox1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
