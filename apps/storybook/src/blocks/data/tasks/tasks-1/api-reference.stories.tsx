import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tasks1 } from '@tc96/ui/blocks/data/tasks/tasks-1'
import { fn } from 'storybook/test'
import { assignees, projects, tags, tasks } from '../fixtures/tasks-1.ts'

const meta = {
  args: {
    assignees,
    onAssigneesChange: fn(),
    onCreate: fn(),
    onDueChange: fn(),
    onGroupByChange: fn(),
    onPageChange: fn(),
    onPriorityChange: fn(),
    onProjectChange: fn(),
    onSearchChange: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStatusChange: fn(),
    onStatusFilterChange: fn(),
    onTagsChange: fn(),
    page: 1,
    pageCount: 1,
    pageSize: 20,
    projects,
    tags,
    tasks,
    total: tasks.length,
  },
  component: Tasks1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Tasks/Tasks1/API Reference',
} satisfies Meta<typeof Tasks1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
