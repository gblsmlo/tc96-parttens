import type { Meta, StoryObj } from '@storybook/react-vite'
import { Documents1 } from '@tc96/ui/blocks/data/documents/documents-1'
import { fn } from 'storybook/test'
import {
  countDocuments,
  people,
  records,
  typeColors,
} from '../fixtures/documents-1.ts'

const meta = {
  args: {
    counts: countDocuments(records),
    onCreateLink: fn(),
    onCreateNote: fn(),
    onCreatePage: fn(),
    onDelete: fn(),
    onDownload: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onPinnedChange: fn(),
    onRename: fn(),
    onSearchChange: fn(),
    onShare: fn(),
    onSortChange: fn(),
    onTypeFilterChange: fn(),
    onUpload: fn(),
    onViewChange: fn(),
    people,
    records,
    typeColors,
  },
  component: Documents1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Documents/Documents1/API Reference',
} satisfies Meta<typeof Documents1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
