import type { Meta, StoryObj } from '@storybook/react-vite'
import { Projects3 } from '@tc96/ui/blocks/data/projects/projects-3'
import { fn } from 'storybook/test'
import { assignees, tags, tasks, types } from '../fixtures/projects-3.ts'

const meta = {
  args: {
    assignees,
    onAssigneeChange: fn(),
    onCreate: fn(),
    onGroupByChange: fn(),
    onModeChange: fn(),
    onPageChange: fn(),
    onPriorityChange: fn(),
    onSearchChange: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStatusChange: fn(),
    onStatusFilterChange: fn(),
    page: 1,
    pageCount: 1,
    pageSize: 20,
    tags,
    tasks: tasks.filter((task) => !task.archived),
    total: tasks.filter((task) => !task.archived).length,
    types,
  },
  component: Projects3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Projects/Projects3/API Reference',
} satisfies Meta<typeof Projects3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
