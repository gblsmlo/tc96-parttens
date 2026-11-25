import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialTasks } from '../collection/fixtures/tasks'
import { DataTableCanvas } from './data-table-canvas.tsx'
import { TASK_PAGE_SIZE, TasksTable } from './data-table-layouts.tsx'

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataTable/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ReleaseTasks: Story = {
  render: () => <TasksTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Tarefas do lançamento' })
    await expect(within(table).getAllByRole('row')).toHaveLength(
      TASK_PAGE_SIZE + 2,
    )
    await expect(
      canvas.getByRole('button', { name: /^Contagem / }),
    ).toHaveTextContent(String(initialTasks.length))
    await expect(
      canvas.getByRole('button', { name: 'Exibição' }),
    ).toBeInTheDocument()
  },
}
