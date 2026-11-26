import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tasks4 } from '@tc96/ui/blocks/data/tasks/tasks-4'
import { fn } from 'storybook/test'
import { now, people, projects, tags, tasks } from '../fixtures/tasks-4.ts'

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
    onSavedViewSelect: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStatusFilterChange: fn(),
    people,
    projects,
    tags,
    tasks,
  },
  component: Tasks4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Tasks/Tasks4/API Reference',
} satisfies Meta<typeof Tasks4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
