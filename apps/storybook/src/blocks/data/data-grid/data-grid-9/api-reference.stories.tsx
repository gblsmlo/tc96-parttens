import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid9 } from '@tc96/ui/blocks/data/data-grid/data-grid-9'
import { fn } from 'storybook/test'
import {
  campaigns,
  initialSort,
  pageSizeOptions,
  period,
  rowActions,
  summary,
} from '../fixtures/data-grid-9.ts'

const meta = {
  args: {
    campaigns,
    onCreate: fn(),
    onExport: fn(),
    onRowAction: fn(),
    pageSize: 8,
    pageSizeOptions,
    period,
    rowActions,
    sort: initialSort,
    summary,
  },
  component: DataGrid9,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid9/API Reference',
} satisfies Meta<typeof DataGrid9>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
