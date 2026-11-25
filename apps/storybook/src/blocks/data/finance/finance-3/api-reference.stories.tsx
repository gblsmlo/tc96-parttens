import type { Meta, StoryObj } from '@storybook/react-vite'
import { Finance3 } from '@tc96/ui/blocks/data/finance/finance-3'
import { fn } from 'storybook/test'
import {
  accounts,
  categories,
  counts,
  entries,
  members,
  pageSize,
} from '../fixtures/finance-3.ts'

const meta = {
  args: {
    accounts,
    categories,
    counts,
    members,
    onAccountFilterChange: fn(),
    onCreate: fn(),
    onOpen: fn(),
    onPageChange: fn(),
    onSelectedIdsChange: fn(),
    onSituationFilterChange: fn(),
    onTypeFilterChange: fn(),
    onViewChange: fn(),
    page: 1,
    pageCount: Math.ceil(entries.length / pageSize),
    pageSize,
    records: entries.slice(0, pageSize),
    total: entries.length,
    variant: 'entries',
  },
  component: Finance3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Finance/Finance3/API Reference',
} satisfies Meta<typeof Finance3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
