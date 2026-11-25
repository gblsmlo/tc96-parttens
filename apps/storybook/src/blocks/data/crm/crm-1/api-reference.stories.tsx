import type { Meta, StoryObj } from '@storybook/react-vite'
import { Crm1 } from '@tc96/ui/blocks/data/crm/crm-1'
import { fn } from 'storybook/test'
import { counts, people, savedViews, tags } from '../fixtures/crm-1.ts'

const meta = {
  args: {
    counts,
    onCreate: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onPageChange: fn(),
    onSavedViewSelect: fn(),
    onSearchChange: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onVariantChange: fn(),
    page: 1,
    pageCount: 1,
    pageSize: 20,
    records: people,
    savedViews,
    tags,
    total: people.length,
    variant: 'people',
  },
  component: Crm1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/CRM/Crm1/API Reference',
} satisfies Meta<typeof Crm1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
