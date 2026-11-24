import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid5 } from '@tc96/ui/blocks/data/data-grid/data-grid-5'
import { fn } from 'storybook/test'
import {
  initialExpanded,
  rowActions,
  tasks,
  viewCounts,
} from '../fixtures/data-grid-5.ts'

const meta = {
  args: {
    expanded: initialExpanded,
    onCreate: fn(),
    onRowAction: fn(),
    onShowSubtasksChange: fn(),
    onViewChange: fn(),
    rowActions,
    tasks,
    view: 'all',
    viewCounts,
  },
  component: DataGrid5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid5/API Reference',
} satisfies Meta<typeof DataGrid5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
