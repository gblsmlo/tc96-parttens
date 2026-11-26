import type { Meta, StoryObj } from '@storybook/react-vite'
import { tasks4ControlArgs } from './tasks-4-controls.ts'
import { ComposedTasks4 } from './tasks-4-layouts.tsx'

const meta = {
  args: tasks4ControlArgs,
  component: ComposedTasks4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks4/Usages',
} satisfies Meta<typeof ComposedTasks4>

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
