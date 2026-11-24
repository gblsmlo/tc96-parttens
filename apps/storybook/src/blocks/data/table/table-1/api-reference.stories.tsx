import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table1 } from '@tc96/ui/blocks/data/table/table-1'
import { fn } from 'storybook/test'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
} from '../fixtures/table-1.ts'

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
  component: Table1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table1/API Reference',
} satisfies Meta<typeof Table1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
