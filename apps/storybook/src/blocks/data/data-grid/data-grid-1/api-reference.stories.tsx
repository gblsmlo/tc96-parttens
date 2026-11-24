import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid1 } from '@tc96/ui/blocks/data/data-grid/data-grid-1'
import { fn } from 'storybook/test'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
} from '../fixtures/data-grid-1.ts'

const meta = {
  args: {
    onAssignOwner: fn(),
    onCreate: fn(),
    onRowAction: fn(),
    onStatusUpdate: fn(),
    owners,
    pageSize: 6,
    pageSizeOptions: [6, 12, 24],
    rowActions,
    selectedIds: ['sup-1831', 'sup-1793'],
    sort: initialSort,
    tickets,
  },
  component: DataGrid1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid1/API Reference',
} satisfies Meta<typeof DataGrid1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
