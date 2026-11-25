import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tasks2 } from '@tc96/ui/blocks/data/tasks/tasks-2'
import { fn } from 'storybook/test'
import {
  createOptions,
  now,
  people,
  projects,
  tags,
  tasks,
} from '../fixtures/tasks-2.ts'

const meta = {
  args: {
    createOptions,
    now,
    onAssigneesChange: fn(),
    onCreate: fn(),
    onDueChange: fn(),
    onGroupByChange: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onProjectChange: fn(),
    onSearchChange: fn(),
    onBulkDelete: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStatusFilterChange: fn(),
    people,
    projects,
    tags,
    tasks,
  },
  component: Tasks2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Tasks/Tasks2/API Reference',
} satisfies Meta<typeof Tasks2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
