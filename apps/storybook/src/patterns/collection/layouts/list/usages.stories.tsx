import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialTasks } from '../../fixtures/tasks'
import { ListCanvas } from './list-canvas.tsx'
import { DocumentRow, TasksList } from './list-layouts.tsx'

const meta = {
  decorators: [ListCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/List/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TasksByStatus: Story = {
  render: () => <TasksList grouping="status" />,
  play: async ({ canvasElement }) => {
    const todo = within(
      within(canvasElement).getByRole('region', { name: 'A fazer' }),
    )
    const firstTodo = initialTasks.find((task) => task.status === 'todo')
    await expect(
      todo.getByRole('heading', { level: 3, name: firstTodo?.title }),
    ).toBeVisible()
  },
}

export const TasksByAssignee: Story = {
  render: () => <TasksList grouping="assignee" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Ana Souza' }),
    ).toBeVisible()
  },
}

export const Document: Story = {
  render: () => <DocumentRow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', {
        level: 2,
        name: 'Contrato de prestação de serviços',
      }),
    ).toBeVisible()
    await expect(canvas.getByText('Mariana Souza')).toBeVisible()
  },
}
