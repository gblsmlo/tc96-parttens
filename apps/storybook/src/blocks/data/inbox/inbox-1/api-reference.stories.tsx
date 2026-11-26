import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox1 } from '@tc96/ui/blocks/data/inbox/inbox-1'
import { fn } from 'storybook/test'
import {
  entries,
  originColors,
  pageSize,
  readInbox,
} from '../fixtures/inbox-1.ts'

const meta = {
  args: {
    entries: readInbox(entries).items,
    onCategoryChange: fn(),
    onMarkRead: fn(),
    onOpen: fn(),
    onPageChange: fn(),
    onReadChange: fn(),
    originColors,
    pageCount: Math.ceil(entries.length / pageSize),
    pageSize,
    total: entries.length,
  },
  component: Inbox1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Inbox/Inbox1/API Reference',
} satisfies Meta<typeof Inbox1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
