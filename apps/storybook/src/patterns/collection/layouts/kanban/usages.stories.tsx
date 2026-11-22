import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialTasks } from '../../fixtures/tasks'
import { KanbanCanvas } from './kanban-canvas.tsx'
import { TaskBoard } from './kanban-layouts.tsx'

const meta = {
  decorators: [KanbanCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Tasks: Story = {
  render: () => <TaskBoard />,
  play: async ({ canvasElement }) => {
    const backlog = within(
      within(canvasElement).getByRole('region', { name: 'Backlog' }),
    )
    const firstTask = initialTasks.find((task) => task.status === 'backlog')
    await expect(backlog.getByText(firstTask?.title ?? '')).toBeVisible()
    await expect(
      within(canvasElement).getByRole('region', { name: 'Concluída' }),
    ).toBeVisible()
  },
}
