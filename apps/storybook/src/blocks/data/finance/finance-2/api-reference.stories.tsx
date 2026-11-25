import type { Meta, StoryObj } from '@storybook/react-vite'
import { Finance2 } from '@tc96/ui/blocks/data/finance/finance-2'
import { fn } from 'storybook/test'
import {
  finance2TotalCount,
  initialSort,
  transactions,
} from '../fixtures/finance-2.ts'

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
    totalCount: finance2TotalCount,
    transactions,
  },
  component: Finance2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Finance/Finance2/API Reference',
} satisfies Meta<typeof Finance2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
