import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support1 } from '@tc96/ui/blocks/data/support/support-1'
import { fn } from 'storybook/test'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
} from '../fixtures/support-1.ts'

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
  component: Support1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Support/Support1/API Reference',
} satisfies Meta<typeof Support1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
