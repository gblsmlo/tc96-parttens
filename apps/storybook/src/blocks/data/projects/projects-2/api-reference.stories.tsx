import type { Meta, StoryObj } from '@storybook/react-vite'
import { Projects2 } from '@tc96/ui/blocks/data/projects/projects-2'
import { fn } from 'storybook/test'
import {
  initialExpanded,
  rowActions,
  tasks,
  viewCounts,
} from '../fixtures/projects-2.ts'

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
  component: Projects2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Projects/Projects2/API Reference',
} satisfies Meta<typeof Projects2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
