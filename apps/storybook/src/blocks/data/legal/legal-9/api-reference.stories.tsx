import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal9 } from '@tc96/ui/blocks/data/legal/legal-9'
import { fn } from 'storybook/test'
import { owners, records, savedViews } from '../fixtures/legal-9.ts'

const meta = {
  args: {
    onBillingModelChange: fn(),
    onBillingModelFilterChange: fn(),
    onBulkBillingModelChange: fn(),
    onBulkOwnerChange: fn(),
    onCreate: fn(),
    onDefaultViewSelect: fn(),
    onGroupByChange: fn(),
    onModeChange: fn(),
    onOwnerChange: fn(),
    onOwnerFilterChange: fn(),
    onPageChange: fn(),
    onSavedViewCreate: fn(),
    onSavedViewSelect: fn(),
    onSavePreference: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStatusFilterChange: fn(),
    owners,
    page: 1,
    pageCount: 1,
    pageSize: 25,
    records,
    savedViews,
    total: records.length,
    viewCount: records.length,
  },
  component: Legal9,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal9/API Reference',
} satisfies Meta<typeof Legal9>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
