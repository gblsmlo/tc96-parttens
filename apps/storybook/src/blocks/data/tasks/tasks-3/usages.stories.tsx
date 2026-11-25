import type { Meta, StoryObj } from '@storybook/react-vite'
import { tasks3ControlArgs } from './tasks-3-controls.ts'
import { ComposedTasks3 } from './tasks-3-layouts.tsx'

const meta = {
  args: tasks3ControlArgs,
  component: ComposedTasks3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks3/Usages',
} satisfies Meta<typeof ComposedTasks3>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {}

export const Board: Story = {
  args: { groupBy: 'status', mode: 'kanban' },
}

export const Empty: Story = {
  args: { empty: true },
}

export const Pending: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
}
