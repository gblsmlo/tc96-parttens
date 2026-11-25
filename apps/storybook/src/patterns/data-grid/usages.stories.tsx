import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialTasks } from '../collection/fixtures/tasks'
import { DataGridCanvas } from './data-grid-canvas.tsx'
import { TasksGrid } from './data-grid-layouts.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const firstTask = () => {
  const [first] = initialTasks
  if (!first) throw new Error('The fixture has no task.')
  return first
}

export const ReleaseTasks: Story = {
  render: () => <TasksGrid />,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', {
      name: 'Tarefas do lançamento',
    })
    await expect(within(grid).getByText(firstTask().title)).toBeVisible()
    await expect(
      within(grid).getByRole('navigation', { name: 'Paginação da tabela' }),
    ).toBeInTheDocument()
  },
}

export const TasksByAssignee: Story = {
  render: () => <TasksGrid grouped />,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', {
      name: 'Tarefas do lançamento',
    })
    await expect(
      grid.querySelectorAll('[data-slot="data-grid-group-row"]').length,
    ).toBeGreaterThan(0)
  },
}
