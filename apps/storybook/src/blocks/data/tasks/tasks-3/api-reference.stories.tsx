import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tasks3 } from '@tc96/ui/blocks/data/tasks/tasks-3'
import { fn } from 'storybook/test'
import { now, people, projects, tags, tasks } from '../fixtures/tasks-3.ts'

const meta = {
  args: {
    now,
    onAssigneeFilterChange: fn(),
    onAssigneesChange: fn(),
    onBulkDelete: fn(),
    onCreate: fn(),
    onDueChange: fn(),
    onGroupByChange: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onPriorityFilterChange: fn(),
    onProjectChange: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStatusFilterChange: fn(),
    people,
    projects,
    tags,
    tasks,
  },
  component: Tasks3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Tasks/Tasks3/API Reference',
} satisfies Meta<typeof Tasks3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
