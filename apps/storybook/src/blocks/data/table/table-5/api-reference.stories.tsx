import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table5 } from '@tc96/ui/blocks/data/table/table-5'
import { fn } from 'storybook/test'
import {
  initialExpanded,
  rowActions,
  tasks,
  viewCounts,
} from '../fixtures/table-5.ts'

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
  component: Table5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table5/API Reference',
} satisfies Meta<typeof Table5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
