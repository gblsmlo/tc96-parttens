import type { Meta, StoryObj } from '@storybook/react-vite'
import { Finance1 } from '@tc96/ui/blocks/data/finance/finance-1'
import { fn } from 'storybook/test'
import {
  finance1TotalCount,
  initialSort,
  transactions,
} from '../fixtures/finance-1.ts'

const meta = {
  args: {
    hasMore: true,
    onExport: fn(),
    onExportSelected: fn(),
    onFlag: fn(),
    onRefund: fn(),
    onFiltersChange: fn(),
    onLoadMore: fn(),
    onRefresh: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
    selectedIds: transactions.slice(0, 2).map((transaction) => transaction.id),
    sort: initialSort,
    totalCount: finance1TotalCount,
    transactions,
  },
  component: Finance1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Finance/Finance1/API Reference',
} satisfies Meta<typeof Finance1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
