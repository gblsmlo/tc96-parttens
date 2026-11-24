import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table8 } from '@tc96/ui/blocks/data/table/table-8'
import { fn } from 'storybook/test'
import {
  initialSort,
  table8TotalCount,
  transactions,
} from '../fixtures/table-8.ts'

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
    totalCount: table8TotalCount,
    transactions,
  },
  component: Table8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table8/API Reference',
} satisfies Meta<typeof Table8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
