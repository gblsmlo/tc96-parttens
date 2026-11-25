import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialDeals } from '../collection/fixtures/deals'
import { initialTasks } from '../collection/fixtures/tasks'
import { KanbanCardCanvas } from './kanban-card-canvas.tsx'
import { DealCardExample, TaskCardExample } from './kanban-card-layouts.tsx'

const meta = {
  decorators: [KanbanCardCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/KanbanCard/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const [firstDeal] = initialDeals

export const Deal: Story = {
  render: () => <DealCardExample />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: `Abrir negócio ${firstDeal?.company}`,
      }),
    ).toBeInTheDocument()
  },
}

export const Task: Story = {
  render: () => <TaskCardExample />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(initialTasks[0]?.title ?? ''),
    ).toBeVisible()
  },
}
