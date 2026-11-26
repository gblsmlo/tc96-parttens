import type { Meta, StoryObj } from '@storybook/react-vite'
import { Documents2 } from '@tc96/ui/blocks/data/documents/documents-2'
import { fn } from 'storybook/test'
import {
  documents2Labels,
  people,
  records,
  typeColors,
} from '../fixtures/documents-2.ts'

const meta = {
  args: {
    labels: documents2Labels,
    onBulkDelete: fn(),
    onBulkDownload: fn(),
    onBulkPinnedChange: fn(),
    onCreateLink: fn(),
    onCreateNote: fn(),
    onDelete: fn(),
    onDownload: fn(),
    onGroupByChange: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onOwnerFilterChange: fn(),
    onPinnedChange: fn(),
    onSavedViewSelect: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onTypeFilterChange: fn(),
    onUpload: fn(),
    people,
    pinnedRecords: records.filter((item) => item.pinned),
    records,
    typeColors,
  },
  component: Documents2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Documents/Documents2/API Reference',
} satisfies Meta<typeof Documents2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
