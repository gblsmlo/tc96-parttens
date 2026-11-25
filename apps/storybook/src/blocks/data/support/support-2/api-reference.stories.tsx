import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support2 } from '@tc96/ui/blocks/data/support/support-2'
import { fn } from 'storybook/test'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
} from '../fixtures/support-2.ts'

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
  component: Support2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Support/Support2/API Reference',
} satisfies Meta<typeof Support2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
