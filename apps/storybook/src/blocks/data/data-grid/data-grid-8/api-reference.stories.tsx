import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid8 } from '@tc96/ui/blocks/data/data-grid/data-grid-8'
import { fn } from 'storybook/test'
import {
  dataGrid8TotalCount,
  initialSort,
  transactions,
} from '../fixtures/data-grid-8.ts'

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
    totalCount: dataGrid8TotalCount,
    transactions,
  },
  component: DataGrid8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid8/API Reference',
} satisfies Meta<typeof DataGrid8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
